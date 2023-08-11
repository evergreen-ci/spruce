import dns from "dns";
import fs from "fs";
import os from "os";
import path from "path";
import { generate } from "@graphql-codegen/cli";
import { getConfig } from "../../codegen";
import { execSync } from "child_process";
import process from "process";

const GITHUB_API = "https://api.github.com";
const GQL_DIR = "graphql/schema";
const LOCAL_SCHEMA = "sdlschema";
const REPO = "/repos/evergreen-ci/evergreen";
const REPO_CONTENTS = `${REPO}/contents/`;
const USER_AGENT = "Mozilla/5.0";

/**
 * Checks if a given domain can be resolved.
 *
 * @async
 * @function
 * @param {string} domain - The domain name to check.
 * @returns {Promise<boolean>} - Resolves to `true` if the domain can be resolved, `false` otherwise.
 */
export const canResolveDNS = (domain: string) =>
  new Promise((resolve) => {
    dns.lookup(domain, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });

/**
 * Get the latest commit that was made to the GQL folder.
 * @returns {Promise<string>} A Promise that resolves to the SHA of the latest commit.
 * @throws {Error} When failed to fetch commits.
 */
export async function getRemoteLatestCommitSha(): Promise<string> {
  const url = `${GITHUB_API}${REPO}/commits?path=${GQL_DIR}&sha=main`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
  }

  const commits = await response.json();

  if (commits.length > 0) {
    return commits[0].sha;
  } else {
    throw new Error(`No commits found for this path: ${url}`);
  }
}

/**
 * Check if the local Evergreen repo contains the latest commit made to the GQL folder.
 * @returns {Promise<boolean>} A Promise that resolves to true if local repo contains the latest commit, and false otherwise.
 * @throws {Error} When an error occurs while executing the command.
 */
export const checkIsAncestor = async (): Promise<boolean> => {
  const remoteSha = await getRemoteLatestCommitSha();
  const localSchemaSymlink = fs.readlinkSync(LOCAL_SCHEMA);
  console.log(localSchemaSymlink);
  const originalDir = process.cwd();
  try {
    process.chdir(localSchemaSymlink);
    execSync(`git merge-base --is-ancestor ${remoteSha} HEAD`);
    process.chdir(originalDir);
    return true;
  } catch (error) {
    process.chdir(originalDir);
    if (error.status === 1) {
      return false;
    }
    throw new Error(`Error executing command: ${error.message}`);
  }
};

/**
 * Download the file at the given url and save it to the given savePath.
 * @param {string} url - The URL of the file to be downloaded.
 * @param {string} savePath - The local path where the file should be saved.
 * @returns {Promise<void>}
 * @throws {Error} When failed to fetch the file.
 */
export const downloadAndSaveFile = async (
  url: string,
  savePath: string
): Promise<void> => {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
  }
  const data = await response.arrayBuffer();
  fs.writeFileSync(savePath, Buffer.from(data));
};

/**
 * Recursively fetch and save the files at the given github repoPath to the given localPath.
 * @param {string} repoPath - The path in the GitHub repository.
 * @param {string} localPath - The local path where the files should be saved.
 * @returns {Promise<void>}
 * @throws {Error} When failed to fetch the files.
 */
export const fetchFiles = async (
  repoPath: string,
  localPath: string
): Promise<void> => {
  const response = await fetch(`${GITHUB_API}${repoPath}`, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${GITHUB_API}${repoPath}. Status: ${response.status}`
    );
  }

  const files = await response.json();
  const promises = files.map((file) => {
    const fileSavePath = path.join(localPath, file.name);
    if (file.type === "file") {
      return downloadAndSaveFile(file.download_url, fileSavePath);
    } else if (file.type === "dir") {
      if (!fs.existsSync(fileSavePath)) {
        fs.mkdirSync(fileSavePath, { recursive: true });
      }
      return fetchFiles(`${REPO_CONTENTS}${file.path}`, fileSavePath);
    }
  });

  await Promise.all(promises);
};

/**
 * Download GQL files from remote and generate types.
 * @returns {Promise<string>} A Promise that resolves to the path of the generated file.
 */
export const downloadAndGenerate = async (): Promise<string> => {
  const tempDir = os.tmpdir();
  fs.mkdirSync(tempDir, { recursive: true });
  await fetchFiles(
    path.join(REPO_CONTENTS, GQL_DIR),
    path.join(tempDir, GQL_DIR)
  );
  const latestGeneratedTypesFileName = `${tempDir}/types.ts`;
  await generate(
    getConfig({
      schema: `${tempDir}/${GQL_DIR}/**/*.graphql`,
      generatedFileName: latestGeneratedTypesFileName,
    }),
    true
  );
  return latestGeneratedTypesFileName;
};
