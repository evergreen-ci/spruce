import { MainlineCommitsForHistoryQuery } from "gql/generated/types";

type CommitRowType = {
  type: rowType;
  commit?:
    | MainlineCommitsForHistoryQuery["mainlineCommits"]["versions"][0]["version"]
    | MainlineCommitsForHistoryQuery["mainlineCommits"]["versions"][0]["rolledUpVersions"];
  date: Date;
};
type mainlineCommits = MainlineCommitsForHistoryQuery["mainlineCommits"];

export enum rowType {
  FOLDED_COMMITS,
  DATE_SEPERATOR,
  COMMIT,
}
const identifyCommitType = (commit: mainlineCommits["versions"][0]) => {
  if (commit.version) {
    return rowType.COMMIT;
  }
  if (commit.rolledUpVersions) {
    return rowType.FOLDED_COMMITS;
  }
};

// takes in 2 dates and returns if the dates are the same day
export const isSameDay = (date1: string | Date, date2: string | Date) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Processed commits are the order of commits in the table.
// They are one of the following:
// - A commit
// - A date seperator
// - A set of commits that are rolled up into a single commit
// The processed commits are used to calculate the height of each row in the table.
// They are ordered by the order of the commits in the table.
export const processCommits = (
  newCommits: mainlineCommits["versions"],
  existingCommits: CommitRowType[]
) => {
  const processedCommits: CommitRowType[] = [...existingCommits];
  for (let i = 0; i < newCommits.length; i++) {
    const commit = newCommits[i];
    const commitType = identifyCommitType(commit);
    const priorCommit =
      processedCommits.length > 0
        ? processedCommits[processedCommits.length - 1]
        : null;
    if (commitType === rowType.COMMIT) {
      const { version } = commit;
      if (priorCommit && isSameDay(version.createTime, priorCommit.date)) {
        processedCommits.push({
          type: rowType.COMMIT,
          commit: version,
          date: version.createTime,
        });
      } else {
        processedCommits.push({
          type: rowType.DATE_SEPERATOR,
          date: version.createTime,
        });
        processedCommits.push({
          type: rowType.COMMIT,
          commit: version,
          date: version.createTime,
        });
      }
    } else if (commitType === rowType.FOLDED_COMMITS) {
      const { rolledUpVersions } = commit;
      const firstRolledUpVersion = rolledUpVersions[0];
      if (
        priorCommit &&
        isSameDay(firstRolledUpVersion.createTime, priorCommit.date)
      ) {
        processedCommits.push({
          type: rowType.FOLDED_COMMITS,
          commit: rolledUpVersions,
          date: firstRolledUpVersion.createTime,
        });
      } else {
        processedCommits.push({
          type: rowType.DATE_SEPERATOR,
          date: firstRolledUpVersion.createTime,
        });
        processedCommits.push({
          type: rowType.FOLDED_COMMITS,
          commit: rolledUpVersions,
          date: firstRolledUpVersion.createTime,
        });
      }
    }
  }
  return processedCommits;
};
