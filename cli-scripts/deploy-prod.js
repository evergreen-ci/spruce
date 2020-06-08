const prompt = require("prompt");
const simpleGit = require("simple-git");
const colors = require("colors/safe");
const promptRun = require("prompt-run");

const git = simpleGit("/Users/treygranderson/Desktop/dev/spruce");

prompt.start();

git
  .init()
  .then(() => () => {})
  .then(() => git.branchLocal())
  .then(({ current }) => {
    if (current !== "master") {
      console.log("Current branch is", current);
      console.log(
        colors.red(
          "Error: You must be on master branch to deploy to production"
        )
      );
      prompt.stop();
    }
  });

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
  function(err, { confirmDeploy }) {
    const confirmDeployLowerCased = confirmDeploy.toLowerCase();
    const isConfirmed =
      confirmDeployLowerCased === "yes" || confirmDeployLowerCased === "y";
    if (isConfirmed) {
      promptRun({
        command: "npm run deploy-prod:do-not-use-directly",
        options: {},
        questions: {
          env: [],
          args: [],
        },
      });
    } else {
      console.log(colors.cyan("Okay, no deploy"));
      prompt.stop();
    }
  }
);
