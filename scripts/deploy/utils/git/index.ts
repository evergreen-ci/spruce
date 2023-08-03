import { execSync } from "child_process";

/**
 * `getCommitMessages` returns a string of all commit messages between the currently deployed commit and HEAD.
 * @param currentlyDeployedCommit - the currently deployed commit
 * @returns - a string of all commit messages between the currently deployed commit and HEAD
 */
const getCommitMessages = (currentlyDeployedCommit: string) => {
  const commitMessages = execSync(
    `git log ${currentlyDeployedCommit}..HEAD --oneline`,
    { encoding: "utf-8" }
  ).toString();
  return commitMessages;
};

/**
 * `getCurrentlyDeployedCommit` is a helper function that returns the currently deployed commit.
 * It will call the `get-current-deployed-commit.sh` script, which will return either a git hash or a git tag.
 * @returns - the currently deployed commit
 */
const getCurrentlyDeployedCommit = () => {
  const currentlyDeployedCommit = execSync(
    "bash scripts/deploy/get-current-deployed-commit.sh",
    { encoding: "utf-8" }
  )
    .toString()
    .trim();
  return currentlyDeployedCommit;
};

/**
 * `getCurrentCommit` is a helper function that returns the current commit.
 * This is different from the currently deployed commit. The currently deployed commit is the commit that is currently deployed to production.
 * The current commit is the commit that is currently checked out on your local machine and will be deployed to production.
 * @returns - the current commit
 */
const getCurrentCommit = () => {
  const currentCommit = execSync("git rev-parse HEAD", {
    encoding: "utf-8",
  })
    .toString()
    .trim();
  return currentCommit;
};

/**
 * `isOnMainBranch` is a helper function that checks if the current branch is the main branch.
 * @returns true if the current branch is the main branch
 */
const isOnMainBranch = () => {
  const result = execSync("git branch --show-current", {
    encoding: "utf-8",
  });
  const isOnMain = result.toString().trim() === "main";
  if (!isOnMain) {
    console.log("Currently on branch:", result.toString().trim());
  }
  return isOnMain;
};

/**
 * `isWorkingDirectoryClean` is a helper function that checks if the working directory is clean (i.e. no uncommitted changes).
 * @returns true if the working directory is clean
 */
const isWorkingDirectoryClean = () => {
  const result = execSync("git status --porcelain", { encoding: "utf-8" });
  if (result.trim() !== "") {
    console.log("Uncommitted changes:");
    console.log(result);
  }
  return result.trim() === "";
};

export {
  getCommitMessages,
  getCurrentlyDeployedCommit,
  getCurrentCommit,
  isOnMainBranch,
  isWorkingDirectoryClean,
};
