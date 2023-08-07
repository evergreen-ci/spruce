import { yellow } from "../../../../utils/colors";

/**
 * `createNewTag` is a helper function that creates a new tag.
 */
const createNewTag = () => {
  console.log(yellow("Dry run mode enabled. Created new tag."));
};

/**
 * `getLatestTag` is a helper function that returns the latest tag.
 * @returns - the latest tag
 */
const getLatestTag = () => {
  console.log(yellow("Dry run mode enabled. Returning dry-run-tag."));
  return "dry-run-tag";
};

/**
 * `deleteTag` is a helper function that deletes a tag.
 * @param tag - the tag to delete
 */
const deleteTag = (tag: string) => {
  console.log(yellow(`Dry run mode enabled. Deleting tag. ${tag}`));
};

/**
 * `pushTags` is a helper function that pushes tags to the remote.
 */
const pushTags = () => {
  console.log(yellow("Dry run mode enabled. Pushing tags."));
};

export { createNewTag, getLatestTag, deleteTag, pushTags };
