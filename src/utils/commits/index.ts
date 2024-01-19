import { FileDiffsFragment } from "gql/generated/types";

export { bucketByCommit } from "./bucketByCommit";

/**
 * Indicates if a user created a patch with the --preserve-commits flag.
 * We can tell that the user opted to preserve commits if the description of a fileDiff is non-empty,
 * as it will contain the associated commit message.
 * @param fileDiffs - array containing the fileDiffs for a particular commit
 * @returns true if commits are preserved, false if otherwise
 */
export const shouldPreserveCommits = (
  fileDiffs: FileDiffsFragment[],
): boolean => {
  if (fileDiffs.length && fileDiffs[0].description !== "") {
    return true;
  }
  return false;
};
