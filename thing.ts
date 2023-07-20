const axios = require("axios");
const simpleGit = require("simple-git");
const fs = require("fs");
const pathModule = require("path");

const owner = "evergreen-ci";
const repo = "evergreen";
const remotePath = "graphql/schema";
const branch = "main";

const localSymlink = "sdlschema";

async function getRemoteLatestCommitTimestamp() {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?path=${remotePath}&sha=${branch}`;

  try {
    const response = await axios.get(url);
    const commits = response.data;

    if (commits.length > 0) {
      return new Date(commits[0].commit.committer.date);
    } else {
      console.log("No commits found for this path.");
      return null;
    }
  } catch (error) {
    console.error("Error getting latest commit:", error.message);
    return null;
  }
}

async function getLocalLatestCommitTimestamp() {
  let targetPath;
  try {
    targetPath = fs.readlinkSync(localSymlink);
  } catch (error) {
    console.error("Error reading the symlink:", error.message);
    return null;
  }

  // Resolve symlink to its absolute path
  const resolvedPath = pathModule.resolve(
    pathModule.dirname(localSymlink),
    targetPath
  );

  try {
    const git = simpleGit(resolvedPath); // Setting the working directory to the symlink's resolved path
    console.log(resolvedPath);
    const log = await git.log({ file: resolvedPath });
    console.log("symlink", log.latest);
    return new Date(log.latest.date);
  } catch (error) {
    console.error("Error getting local commit:", error.message);
    return null;
  }
}

(async function compareCommits() {
  const remoteTimestamp = await getRemoteLatestCommitTimestamp();
  const localTimestamp = await getLocalLatestCommitTimestamp();

  if (!remoteTimestamp || !localTimestamp) {
    console.log("Failed to retrieve one or both timestamps.");
    return;
  }

  if (localTimestamp.getTime() >= remoteTimestamp.getTime()) {
    console.log("Local commit is newer or the same as the remote commit.");
  } else {
    console.log("Remote commit is newer than the local commit.");
  }
})();
