/* eslint-disable no-console */
const colors = require("colors/safe");
const prompt = require("prompt");
const simpleGit = require("simple-git");
const path = require("path");
const { execSync } = require("child_process");
const { exit } = require("process");
const { getLatestCommitsSinceLastRelease } = require("./deploy-utils");

const git = simpleGit(path.resolve(__dirname, ".."));

const checkIfOnMain = async () => {
  await git.init();
  const { current } = await git.branchLocal();
  if (current !== "main") {
    console.log("Current branch is", current);
    console.log(
      colors.red("Error: You must be on main branch to deploy to production")
    );
    return false;
  }
  return true;
};

// Runs the script to build and deploy to production
const deployProcess = () => {
  console.log("Pushing deploy tags");
  // run command to push deploy tags
  execSync(
    "git push upstream && git push upstream --tags && git push origin && git push origin --tags",
    { stdio: "inherit" }
  );
  console.log("Successfully Scheduled Deploy! 🎉");
  console.log(
    "You can track the deploy at https://spruce.mongodb.com/commits/spruce?requester=git_tag_request&taskNames=deploy_to_prod"
  );
};

const deployProd = async () => {
  const onMain = await checkIfOnMain();
  const latestCommits = await getLatestCommitsSinceLastRelease();
  const anyChangesFound = latestCommits.length > 0;
  if (anyChangesFound) {
    console.log(latestCommits);
  } else {
    console.log(colors.red("No Changes found"));
  }
  if (onMain && anyChangesFound) {
    prompt.start();
    prompt.get(
      {
        properties: {
          confirmDeploy: {
            description: colors.magenta(
              "Are you sure you want to deploy to production? [Y/N]"
            ),
          },
        },
      },
      (_, { confirmDeploy }) => {
        const confirmDeployLowerCased = confirmDeploy.toLowerCase();
        const isConfirmed =
          confirmDeployLowerCased === "yes" || confirmDeployLowerCased === "y";
        if (isConfirmed) {
          try {
            execSync("yarn version --new-version patch", { stdio: "inherit" });
            deployProcess();
          } catch (err) {
            console.log(colors.red(err));
            exit(1);
          }
        } else {
          console.log("Received No Confirmation, Exiting");
        }
      }
    );
  } else if (onMain) {
    // In case user wants to kick of a manual deploy if the automated deploy fails or we want to roll back
    prompt.get(
      {
        properties: {
          confirmDeploy: {
            description: colors.magenta(
              "Would you like to deploy manually anyways? [Y | N]"
            ),
          },
        },
      },
      (_, { confirmDeploy }) => {
        const confirmDeployLowerCased = confirmDeploy.toLowerCase();
        const isConfirmed =
          confirmDeployLowerCased === "yes" || confirmDeployLowerCased === "y";
        if (isConfirmed) {
          try {
            execSync("yarn deploy-prod:do-not-use-directly", {
              stdio: "inherit",
            });
            console.log("Successfully Deployed! 🎉");
          } catch (err) {
            console.log(colors.red(err));
            exit(1);
          }
        } else {
          console.log(colors.cyan("Okay, no deploy"));
          prompt.stop();
        }
      }
    );
  } else {
    console.log("Aborting deploy, you must be on main to deploy!");
  }
};

deployProd();
