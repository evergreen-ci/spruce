/* eslint-disable no-console */
const colors = require("colors/safe");
const { execSync } = require("child_process");

const getLatestReleaseTag = () =>
  execSync("git describe --tags `git rev-list --tags --max-count=1`", {
    encoding: "utf-8",
  }).trim();

// Fetches all the commits since the last release tag if there are no commits
// since the last release it returns false otherwise prints out all the commits
const getLatestCommitsSinceLastRelease = async () => {
  try {
    const latestRelease = getLatestReleaseTag();
    const latestCommits = execSync(`git log --oneline ${latestRelease}..HEAD`, {
      encoding: "utf-8",
    });

    return latestCommits;
  } catch (e) {
    console.log(
      colors.bgRed(
        `Error occured when trying to parse commits.\nThere is likely something wrong with your commit history:\n ${e}`
      )
    );
  }
};

module.exports = { getLatestReleaseTag, getLatestCommitsSinceLastRelease };
