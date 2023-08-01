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
    "bash scripts/get-current-deployed-commit.sh",
    { encoding: "utf-8" }
  )
    .toString()
    .trim();
  console.log("Currently deployed commit:", currentlyDeployedCommit);
  return currentlyDeployedCommit;
};
/**
 * `runDeploy` is a helper function that actually performs the deploy.
 * It builds the production bundle, deploys it to the production server, and sends an email.
 */
const runDeploy = () => {
  console.log("GETTING LATEST DEPLOYED COMMIT");
  getCurrentlyDeployedCommit();
  console.log("BUILDING");
  execSync("yarn build:prod", { stdio: "inherit" });
  console.log("DEPLOYING");
  if (!isDryRun) {
    execSync("yarn deploy:do-not-use", {
      stdio: "inherit",
    });
    console.log("SENDING EMAIL");
    execSync("./scripts/email.sh", { stdio: "inherit" });
  }
};

/**
 * `isOnMainBranch` is a helper function that checks if the current branch is the main branch.
 * @returns true if the current branch is the main branch
 */
const isOnMainBranch = () => {
  console.log("Checking if you are on the main branch");
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
  return result.trim() === "";
};

const isRunningOnCI = () => process.env.CI === "true";

const isDryRun = process.argv.includes("--dry-run");

export {
  getCommitMessages,
  getCurrentlyDeployedCommit,
  isOnMainBranch,
  isRunningOnCI,
  isDryRun,
  isWorkingDirectoryClean,
  runDeploy,
};
