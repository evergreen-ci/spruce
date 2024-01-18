import { FileDiffsFragment } from "gql/generated/types";

/**
 * Takes a list of fileDiffs and returns a 2-dim array of fileDiffs
 * where 1st-dim represents commit groupings ordered chronologically.
 * FileDiffsFragment.description represents a commit
 * @param fileDiffs - list of fileDiffs
 * @returns 2-dim array of fileDiffs
 */
export const bucketByCommit = (
  fileDiffs: FileDiffsFragment[],
): FileDiffsFragment[][] =>
  fileDiffs.reduce((accum: FileDiffsFragment[][], curr) => {
    const targetArr = accum.find((d) => d[0].description === curr.description);
    if (targetArr) {
      targetArr.push(curr);
    } else {
      accum.push([curr]);
    }
    return accum;
  }, []);
