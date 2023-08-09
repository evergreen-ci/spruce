import prompts from "prompts";
import { tagUtils } from "./utils/git/tag";
import { green, underline } from "../utils/colors";
import { isRunningOnCI } from "./utils/environment";
import { getCommitMessages, getCurrentlyDeployedCommit } from "./utils/git";
import { runDeploy } from "./utils/deploy";

const { createNewTag, deleteTag, getLatestTag, pushTags } = tagUtils;
/* Deploy by pushing a git tag, to be picked up and built by Evergreen, and deployed to S3. */
const evergreenDeploy = async () => {
  const currentlyDeployedCommit = getCurrentlyDeployedCommit();
  console.log(`Currently Deployed Commit: ${currentlyDeployedCommit}`);

  const commitMessages = getCommitMessages(currentlyDeployedCommit);

  // If there are no commit messages, ask the user if they want to delete and re-push the latest tag, thereby forcing a deploy with no new commits.
  if (commitMessages.length === 0) {
    const latestTag = getLatestTag();
    const response = await prompts({
      type: "confirm",
      name: "value",
      message: `No new commits. Do you want to trigger a deploy on the most recent existing tag? (${latestTag})`,
      initial: false,
    });

    const forceDeploy = response.value;
    if (forceDeploy) {
      console.log(`Deleting tag (${latestTag}) from remote...`);
      deleteTag(latestTag);
      console.log("Pushing tags...");
      pushTags();
      console.log("Check Evergreen for deploy progress.");
      return;
    }

    console.log(
      "Deploy canceled. If systems are experiencing an outage and you'd like to push the deploy directly to S3, run yarn deploy:prod --local."
    );
    return;
  }

  // Print all commits between the last tag and the current commit
  console.log(`Commit messages:\n${commitMessages}`);

  const response = await prompts({
    type: "confirm",
    name: "value",
    message: "Are you sure you want to deploy to production?",
  });

  if (response.value) {
    try {
      console.log("Creating new tag...");
      createNewTag();
      console.log("Pushing tags...");
      pushTags();
      console.log("Pushed to remote. Should be deploying soon...");
      console.log(
        green(
          `Track deploy progress at ${underline(
            "https://spruce.mongodb.com/commits/spruce?requester=git_tag_request"
          )}`
        )
      );
    } catch (err) {
      console.error(err);
      console.error("Creating tag failed. Aborting.");
      process.exit(1);
    }
  }
};

/* Deploy by generating a production build locally and pushing it directly to S3. */
const localDeploy = async () => {
  const response = await prompts({
    type: "confirm",
    name: "value",
    message:
      "Are you sure you'd like to build Spruce locally and push directly to S3? This is a high-risk operation that requires a correctly configured local environment.",
  });

  if (response.value) {
    try {
      runDeploy();
    } catch (err) {
      console.error(err);
      console.error("Local deploy failed. Aborting.");
      process.exit(1);
    }
  }
};

/**
 * `ciDeploy` is a special deploy function that is only run on CI. It does the actual deploy to S3.
 */
const ciDeploy = async () => {
  if (!isRunningOnCI()) {
    throw new Error("Not running on CI");
  }
  try {
    const ciDeployOutput = runDeploy();
    console.log(ciDeployOutput);
  } catch (err) {
    console.error(err);
    console.error("CI deploy failed. Aborting.");
    process.exit(1);
  }
};

export { evergreenDeploy, localDeploy, ciDeploy };
