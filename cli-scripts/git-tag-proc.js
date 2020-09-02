const { execSync } = require("child_process");

const getLatestReleaseTag = () =>
  execSync("git describe --tags `git rev-list --tags --max-count=1`", {
    encoding: "utf-8",
  }).trim();

module.exports = getLatestReleaseTag;
