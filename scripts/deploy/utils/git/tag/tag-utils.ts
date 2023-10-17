import { execSync } from "child_process";
import { githubRemote } from "./constants";

/**
 * `createNewTag` is a helper function that creates a new tag.
 * @returns true if tag creation is successful and false otherwise.
 */
const createNewTag = () => {
  console.log("Creating new tag...");
  try {
    execSync("yarn version --new-version patch", {
      encoding: "utf-8",
      stdio: "inherit",
    });
  } catch (err) {
    console.log("Creating new tag failed.");
    console.log("output", err);
    return false;
  }
  return true;
};

/**
 * `getLatestTag` is a helper function that returns the latest tag.
 * @returns - the latest tag
 */
const getLatestTag = () => {
  const latestTag = execSync("git describe --tags --abbrev=0", {
    encoding: "utf-8",
  })
    .toString()
    .trim();
  return latestTag;
};

/**
 * `deleteTag` is a helper function that deletes a tag.
 * @param tag - the tag to delete
 * @returns true if deleting tags is successful adn false otherwise
 */
const deleteTag = (tag: string) => {
  console.log(`Deleting tag (${tag}) from remote...`);
  const deleteCommand = `git push --delete ${githubRemote} ${tag}`;
  try {
    execSync(deleteCommand, { stdio: "inherit", encoding: "utf-8" });
  } catch (err) {
    console.log("Deleting tag failed.");
    console.log("output", err);
    return false;
  }
  return true;
};

/**
 * `pushTags` is a helper function that pushes tags to the remote.
 * @returns true if pushing tags is successful and false otherwise.
 */
const pushTags = () => {
  console.log("Pushing tags...");
  try {
    execSync(`git push --tags ${githubRemote}`, {
      stdio: "inherit",
      encoding: "utf-8",
    });
  } catch (err) {
    console.log("Pushing tags failed.");
    console.log("output", err);
    return false;
  }
  return true;
};

export { createNewTag, getLatestTag, deleteTag, pushTags };
