const { exec } = require("child_process");

const githubRemote = "https://github.com/evergreen-ci/spruce";
const localDeployScript =
  "yarn build:prod && env-cmd -e production yarn deploy:do-not-use && env-cmd -e production ./scripts/email.sh";

const createNewTag = () =>
  new Promise((resolve, reject) => {
    exec("yarn version --new-version patch", (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout);
    });
  });

const getCommitMessages = (currentlyDeployedCommit) =>
  new Promise((resolve, reject) => {
    exec(
      `git log ${currentlyDeployedCommit}..HEAD --oneline`,
      (err, stdout) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(stdout);
      }
    );
  });

const getCurrentlyDeployedCommit = () =>
  new Promise((resolve, reject) => {
    exec("bash scripts/get-current-deployed-commit.sh", (err, stdout) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      console.log(stdout);
      // Regex for githash
      const githashRegex = /[a-z0-9]{40}/gm;
      // Regex for git tag
      const gitTagRegex = /v[0-9]+\.[0-9]+\.[0-9]+/gm;
      const githash = stdout.match(githashRegex);
      const gitTag = stdout.match(gitTagRegex);
      if (githash) {
        resolve(githash[0]);
      } else if (gitTag) {
        resolve(gitTag[0]);
      } else {
        reject(
          new Error(
            "Could not find a githash or git tag in the output of get-current-deployed-commit.sh"
          )
        );
      }
    });
  });

const getLatestTag = () =>
  new Promise((resolve, reject) => {
    exec("git describe --tags --abbrev=0", (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout);
    });
  });

const deleteTag = (tag) => {
  const deleteCommand = `git push --delete ${githubRemote} ${tag}`;
  return new Promise((resolve, reject) => {
    exec(deleteCommand, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout);
    });
  });
};

const pushTags = () =>
  new Promise((resolve, reject) => {
    exec(`git push --tags ${githubRemote}`, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout);
    });
  });

const runLocalDeploy = () =>
  new Promise((resolve, reject) => {
    exec(localDeployScript, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout);
    });
  });

const isOnMainBranch = () =>
  new Promise((resolve, reject) => {
    exec("git branch --show-current", (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout.trim() === "main");
    });
  });

const isWorkingDirectoryClean = () =>
  new Promise((resolve, reject) => {
    exec("git status --porcelain", (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout.trim() === "");
    });
  });

module.exports = {
  createNewTag,
  deleteTag,
  getCommitMessages,
  getCurrentlyDeployedCommit,
  getLatestTag,
  isOnMainBranch,
  isWorkingDirectoryClean,
  pushTags,
  runLocalDeploy,
};
