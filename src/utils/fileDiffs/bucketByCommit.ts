import { CodeChangesTableFileDiffsFragment } from "gql/generated/types";

/**
 * Takes a list of fileDiffs and returns a 2-dim array of fileDiffs
 * where 1st-dim represents commit groupings ordered chronologically.
 * CodeChangesTableFileDiffsFragment.description represents a commit
 */
export const bucketByCommit = (
  fileDiffs: CodeChangesTableFileDiffsFragment[]
): CodeChangesTableFileDiffsFragment[][] =>
  fileDiffs.reduce((accum: CodeChangesTableFileDiffsFragment[][], curr) => {
    const targetArr = accum.find((d) => d[0].description === curr.description);
    if (targetArr) {
      targetArr.push(curr);
    } else {
      accum.push([curr]);
    }
    return accum;
  }, []);
