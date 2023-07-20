import fs from "fs";
import os from "os";
import path from "path";
import { generate } from "@graphql-codegen/cli";
import {
  getConfig,
  generatedFileName as localGeneratedTypesFileName,
} from "../codegen";
const { execSync } = require("child_process");
import process from "process";

const GITHUB_API = "https://api.github.com";
const GQL_DIR = "graphql/schema";
const REPO = "/repos/evergreen-ci/evergreen";
const REPO_CONTENTS = `${REPO}/contents/`;
const USER_AGENT = "Mozilla/5.0";
const LOCAL_SCHEMA = "sdlschema";

async function getRemoteLatestCommitSha() {
  const url = `${GITHUB_API}${REPO}/commits?path=${GQL_DIR}&sha=main`;
  console.log(url);
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
const checkIsAncestor = async () => {
  const remoteSha = await getRemoteLatestCommitSha();
  const localSchemaSymlink = fs.readlinkSync(LOCAL_SCHEMA);

  try {
    process.chdir(localSchemaSymlink);
    console.log(process.cwd());
    execSync(`git merge-base --is-ancestor ${remoteSha} HEAD`);
    // If the command was successful without errors, then the commit is an ancestor
    return true;
  } catch (error) {
    if (error.status === 1) {
      // git merge-base --is-ancestor returns exit code 1 if not an ancestor, which is not an "error" in traditional sense
      return false;
    }
    throw new Error(`Error executing command: ${error.message}`);
  }
};

const downloadAndSaveFile = async (url: string, savePath: string) => {
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

const fetchFiles = async (repoPath: string, localPath: string) => {
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

const downloadAndGenerate = async () => {
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

const diffTypes = async () => {
  try {
    await checkIsAncestor();
    const latestGeneratedTypesFileName = await downloadAndGenerate();
    const filenames = [
      latestGeneratedTypesFileName,
      localGeneratedTypesFileName,
    ];
    filenames.forEach((filename) => {
      if (!fs.existsSync(filename)) {
        console.error(
          `Types file located at ${filename} does not exist. Validation failed.`
        );
        process.exit(1);
      }
    });
    const [file1, file2] = filenames.map((filename) =>
      fs.readFileSync(filename)
    );
    if (!file1.equals(file2)) {
      console.error(
        "The codegen task will fail in CI. Run 'yarn codegen' against the latest Evergreen code."
      );
      process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    console.error(
      `An issue occured validating the generated GQL types file: ${error}`
    );
    process.exit(1);
  }
};

diffTypes();
