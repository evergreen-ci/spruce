/* eslint-disable no-console */
const colors = require("colors/safe");
const prompt = require("prompt");
const promptRun = require("prompt-run");
const simpleGit = require("simple-git");
const path = require("path");
const { getLatestCommitsSinceLastRelease } = require("./deploy-utils");

const git = simpleGit(path.resolve(__dirname, ".."));

const checkIfOnMaster = async () => {
  await git.init();
  const { current } = await git.branchLocal();
  if (current !== "master") {
    console.log("Current branch is", current);
    console.log(
      colors.red("Error: You must be on master branch to deploy to production")
    );
    return false;
  }
  return true;
};

// Runs the script to build and deploy to production
const deployProcess = () => {
  promptRun({
    command: "npm run deploy-prod:do-not-use-directly",
    options: {},
    questions: {
      env: [],
      args: [],
    },
  }).then((childProcess) => {
    childProcess.on("close", () => {
      console.log("Deploy Complete! 🎉");
      console.log("Don't forget to push tags");
      console.log(
        colors.green("git push upstream && git push upstream --tags")
      );
    });
  });
};

const deployProd = async () => {
  const onMaster = await checkIfOnMaster();
  const latestCommits = await getLatestCommitsSinceLastRelease();
  const anyChangesFound = latestCommits.length > 0;
  if (anyChangesFound) {
    console.log(latestCommits);
  } else {
    console.log(colors.red("No Changes found"));
  }
  if (onMaster && anyChangesFound) {
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
      (confirmDeployerr, { confirmDeploy }) => {
        const confirmDeployLowerCased = confirmDeploy.toLowerCase();
        const isConfirmed =
          confirmDeployLowerCased === "yes" || confirmDeployLowerCased === "y";
        if (isConfirmed) {
          // Version our releases using npm version which creates a git tag
          // So we can keep track of changes between each release
          prompt.get(
            {
              properties: {
                version: {
                  description: colors.magenta(
                    "How would you like to version this release? major | minor | patch"
                  ),
                },
              },
            },
            (versionerr, { version }) => {
              const versionChoices = ["major", "minor", "patch"];
              const choice = version.toLowerCase();
              if (versionChoices.includes(choice)) {
                promptRun({
                  command: `npm run notify-email`,
                  options: {},
                  questions: {
                    env: [],
                    args: [],
                  },
                });
                promptRun({
                  command: `npm version ${choice}`,
                  options: {},
                  questions: {
                    env: [],
                    args: [],
                  },
                }).then((childProcess) => {
                  childProcess.on("close", () => {
                    deployProcess();
                  });
                });
              } else {
                console.log(colors.cyan("Okay, no deploy"));
                prompt.stop();
              }
            }
          );
        } else {
          console.log("ending");
        }
      }
    );
  } else if (onMaster) {
    prompt.get(
      {
        properties: {
          confirmDeploy: {
            description: colors.magenta(
              "Would you like to deploy anyways? [Y | N]"
            ),
          },
        },
      },
      (err, { confirmDeploy }) => {
        const confirmDeployLowerCased = confirmDeploy.toLowerCase();
        const isConfirmed =
          confirmDeployLowerCased === "yes" || confirmDeployLowerCased === "y";
        if (isConfirmed) {
          deployProcess();
        } else {
          console.log(colors.cyan("Okay, no deploy"));
          prompt.stop();
        }
      }
    );
  } else {
    console.log("Aborting deploy, you must be on master to deploy!");
  }
};

deployProd();
