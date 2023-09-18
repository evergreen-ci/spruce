import dns from "dns";
import fs from "fs";
import os from "os";
import { generate } from "@graphql-codegen/cli";
import { execSync } from "child_process";
import process from "process";
import { getConfig } from "../../codegen";

const GITHUB_API = "https://api.github.com";
const GQL_DIR = "graphql/schema";
const LOCAL_SCHEMA = "sdlschema";
const REPO = "/repos/evergreen-ci/evergreen";

/**
 * Get the latest commit that was made to the GQL folder of the remote Evergreen repository.
 * @returns A Promise that resolves to the SHA of the latest commit.
 * @throws {Error} When failed to fetch commits.
 */
export const getLatestCommitFromRemote = async (): Promise<string> => {
  const url = `${GITHUB_API}${REPO}/commits?path=${GQL_DIR}&sha=main`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
  }

  const commits = await response.json();

  if (commits.length > 0) {
    return commits[0].sha;
  }
  throw new Error(`No commits found for this path: ${url}`);
};

/**
 * Check if the local Evergreen repo contains a given commit.
 * @param commit The commit string that will be checked to see if it exists in the Evergreen repo.
 * @returns A Promise that resolves to true if local repo contains the given commit, and false otherwise.
 * @throws {Error} When an error occurs while executing the command.
 */
export const checkIsAncestor = async (commit: string): Promise<boolean> => {
  const localSchemaSymlink = fs.readlinkSync(LOCAL_SCHEMA);
  const originalDir = process.cwd();
  try {
    process.chdir(localSchemaSymlink);
    execSync(`git merge-base --is-ancestor ${commit} HEAD`);
    process.chdir(originalDir);
    return true;
  } catch (error) {
    process.chdir(originalDir);
    // Error status 1 and 128 means that the commit is not an anecestor and the user must fetch.
    // Error code docs: https://www.git-scm.com/docs/api-error-handling/
    if (error.status === 1 || error.status === 128) {
      return false;
    }
    throw new Error(`Error checking ancestor: ${error.message}`);
  }
};

/**
 * Generate types based on sdlschema.
 * @returns A Promise that resolves to the path of the generated file.
 */
export const generateTypes = async (): Promise<string> => {
  const generatedFileName = `${os.tmpdir()}/types.ts`;
  await generate(
    getConfig({
      generatedFileName,
      silent: true,
    }),
    true
  );
  return generatedFileName;
};
