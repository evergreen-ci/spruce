import { execSync } from "child_process";
import { githubRemote } from "./constants";
import { isDryRun } from "./deploy-utils";
import { yellow } from "./colors";

/**
 * `createNewTag` is a helper function that creates a new tag.
 */
const createNewTag = () => {
  if (isDryRun) {
    console.log(yellow("Dry run mode enabled. Creating new tag."));
  } else {
    execSync("yarn version --new-version patch", {
      encoding: "utf-8",
      stdio: "inherit",
    });
  }
};

/**
 * `getLatestTag` is a helper function that returns the latest tag.
 * @returns - the latest tag
 */
const getLatestTag = () => {
  if (isDryRun) {
    console.log(yellow("Dry run mode enabled. Returning dry-run-tag."));
    return "dry-run-tag";
  }
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
 */
const deleteTag = (tag: string) => {
  if (isDryRun) {
    console.log(yellow("Dry run mode enabled. Deleting tag."));
  } else {
    const deleteCommand = `git push --delete ${githubRemote} ${tag}`;
    execSync(deleteCommand, { stdio: "inherit", encoding: "utf-8" });
  }
};

/**
 * `pushTags` is a helper function that pushes tags to the remote.
 */
const pushTags = () => {
  if (isDryRun) {
    console.log(yellow("Dry run mode enabled. Pushing tags."));
  } else {
    execSync(`git push --tags ${githubRemote}`, {
      stdio: "inherit",
      encoding: "utf-8",
    });
  }
};

export { createNewTag, getLatestTag, deleteTag, pushTags };
