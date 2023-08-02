import { execSync } from "child_process";
import { green } from "../../../utils/colors";
import { getCurrentCommit, getCurrentlyDeployedCommit } from "../git";
import { isDryRun } from "../environment";

/**
 * `runDeploy` is a helper function that actually performs the deploy.
 * It builds the production bundle, deploys it to the production server, and sends an email.
 */
const runDeploy = () => {
  console.log(green("Getting currently deployed commit"));
  const currentlyDeployedCommit = getCurrentlyDeployedCommit();
  console.log(currentlyDeployedCommit);
  console.log("BUILDING");
  execSync("yarn build:prod", { stdio: "inherit" });
  console.log("BUILD COMPLETE");
  console.log("SAVING CURRENT COMMIT in build/commit.txt");
  const currentCommit = getCurrentCommit();
  execSync(`echo ${currentCommit} > build/commit.txt`, {
    stdio: "inherit",
  });
  console.log(green("Deploying to production"));
  if (!isDryRun) {
    execSync("yarn deploy:do-not-use", {
      stdio: "inherit",
    });
  }
  console.log(green("Sending email"));

  if (!isDryRun) {
    execSync("./scripts/deploy/email.sh", { stdio: "inherit" });
  } else {
    const email = execSync("git config user.email", {
      encoding: "utf-8",
    }).toString();
    console.log(yellow(`Dry run mode enabled. Sending email to ${email}`));
    execSync(`DEPLOYS_EMAIL=${email} ./scripts/deploy/email.sh`, {
      stdio: "inherit",
    });
  }
};

export { runDeploy };
