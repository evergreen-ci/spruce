import { execSync } from "child_process";
import { green, underline } from "../../../../utils/colors";

/**
 * `createTagAndPush` is a helper function that creates a new tag.
 * Pushing occurs in the postversion hook triggered by "yarn version"
 * @param version - version indicates the type of upgrade of the new tag.
 */
const createTagAndPush = (version: "patch" | "minor" | "major") => {
  console.log("Creating new tag...");
  try {
    execSync(`yarn version --new-version ${version}`, {
      encoding: "utf-8",
      stdio: "inherit",
    });
  } catch (err) {
    throw new Error("Creating new tag failed.", { cause: err });
  }
  console.log("Pushed to remote. Should be deploying soon...");
  console.log(
    green(
      `Track deploy progress at ${underline(
        "https://spruce.mongodb.com/commits/spruce?requester=git_tag_request",
      )}`,
    ),
  );
};

/**
 * `getLatestTag` is a helper function that returns the latest tag.
 * @returns - the latest tag
 */
const getLatestTag = () => {
  try {
    const latestTag = execSync("git describe --tags --abbrev=0", {
      encoding: "utf-8",
    })
      .toString()
      .trim();
    return latestTag;
  } catch (err) {
    throw new Error("Getting latest tag failed.", { cause: err });
  }
};

/**
 * `deleteTag` is a helper function that deletes a tag.
 * @param tag - the tag to delete
 */
const deleteTag = (tag: string) => {
  console.log(`Deleting tag (${tag}) from remote...`);
  const deleteCommand = `git push --delete upstream ${tag}`;
  try {
    execSync(deleteCommand, { stdio: "inherit", encoding: "utf-8" });
  } catch (err) {
    throw new Error("Deleting tag failed.", { cause: err });
  }
};

/**
 * `pushTags` is a helper function that pushes tags to the remote.
 */
const pushTags = () => {
  console.log("Pushing tags...");
  try {
    execSync(`git push --tags upstream`, {
      stdio: "inherit",
      encoding: "utf-8",
    });
  } catch (err) {
    throw new Error("Pushing tags failed.", { cause: err });
  }
};

export { createTagAndPush, getLatestTag, deleteTag, pushTags };
