const prompts = require("prompts");
const {
  createNewTag,
  deleteTag,
  getCommitMessages,
  getLatestTag,
  isOnMainBranch,
  isWorkingDirectoryClean,
  pushTags,
  runLocalDeploy,
} = require("./deploy-utils");

/* Deploy by pushing a git tag, to be picked up and built by Evergreen, and deployed to S3. */
const evergreenDeploy = async () => {
  if (!(await isOnMainBranch())) {
    console.log("You must be on the main branch to deploy!");
    return;
  }
  if (!(await isWorkingDirectoryClean())) {
    console.log("You must have a clean working directory to deploy");
    return;
  }

  const commitMessages = await getCommitMessages();

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
      console.log("Creating tag failed. Aborting.");
    }
  }
};

/* Deploy by generating a production build locally and pushing it directly to S3. */
const localDeploy = async () => {
  if (!(await isOnMainBranch())) {
    console.log("You must be on the main branch to deploy!");
    return;
  }
  if (!(await isWorkingDirectoryClean())) {
    console.log("You must have a clean working directory to deploy");
    return;
  }

  const response = await prompts({
    type: "confirm",
    name: "value",
    message:
      "Are you sure you'd like to build Spruce locally and push directly to S3? This is a high-risk operation that requires a correctly configured local environment.",
  });

  if (response.value) {
    try {
      const localDeployOutput = await runLocalDeploy();
      console.log(localDeployOutput);
    } catch (err) {
      console.error(err);
      console.error("Local deploy failed. Aborting.");
    }
  }
};

const deleteAndPushLatestTag = async () => {
  try {
    const latestTag = await getLatestTag();
    console.log(`Deleting and re-pushing latest tag (${latestTag})`);
    console.log(await deleteTag(latestTag));
    console.log(await pushTags());
  } catch (err) {
    console.error(err);
    console.error("Deleting and pushing tag failed. Aborting.");
  }
};

module.exports = { evergreenDeploy, localDeploy };
