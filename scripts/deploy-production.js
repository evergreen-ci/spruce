const prompts = require("prompts");
const {
  createNewTag,
  deleteAndPushLatestTag,
  getCommitMessages,
  getCurrentlyDeployedCommit,
  isRunningOnCI,
  runDeploy,
} = require("./deploy-utils");

/* Deploy by pushing a git tag, to be picked up and built by Evergreen, and deployed to S3. */
const evergreenDeploy = async () => {
  const currentlyDeployedCommit = getCurrentlyDeployedCommit();
  console.log(`Currently Deployed Commit: ${currentlyDeployedCommit}`);

  const commitMessages = getCommitMessages(currentlyDeployedCommit);

  // If there are no commit messages, ask the user if they want to delete and re-push the latest tag, thereby forcing a deploy with no new commits.
  if (commitMessages.length === 0) {
    const response = await prompts({
      type: "confirm",
      name: "value",
      message:
        "No new commits. Do you want to deploy the most recent existing tag?",
      initial: false,
    });

    const forceDeploy = response.value;
    if (forceDeploy) {
      await deleteAndPushLatestTag();
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
      const createTagOutput = await createNewTag();
      console.log(createTagOutput);
      console.log("Pushed to remote. Should be deploying soon...");
      console.log(
        "Track deploy progress at https://spruce.mongodb.com/commits/spruce?requester=git_tag_request"
      );
    } catch (err) {
      console.log(err);
      throw new Error("Creating tag failed. Aborting.");
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
      console.error("Local deploy failed. Aborting.");
      throw new Error(err);
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
    const ciDeployOutput = await runDeploy();
    console.log(ciDeployOutput);
  } catch (err) {
    console.error("CI deploy failed. Aborting.");
    throw new Error(err);
  }
};

module.exports = { evergreenDeploy, localDeploy, ciDeploy };
