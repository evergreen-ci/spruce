import {
  FOLDED_COMMITS_HEIGHT,
  COMMIT_HEIGHT,
  DATE_SEPARATOR_HEIGHT,
} from "./constants";
import { mainlineCommits, CommitRowType, rowType } from "./types";

// Processed commits are the order of commits in the table.
// They are one of the following:
// - A commit
// - A date separator
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
          rowHeight: COMMIT_HEIGHT,
        });
      } else {
        processedCommits.push({
          type: rowType.DATE_SEPARATOR,
          date: version.createTime,
          rowHeight: DATE_SEPARATOR_HEIGHT,
        });
        processedCommits.push({
          type: rowType.COMMIT,
          commit: version,
          date: version.createTime,
          rowHeight: COMMIT_HEIGHT,
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
          rolledUpCommits: rolledUpVersions,
          date: firstRolledUpVersion.createTime,
          rowHeight: FOLDED_COMMITS_HEIGHT,
        });
      } else {
        processedCommits.push({
          type: rowType.DATE_SEPARATOR,
          date: firstRolledUpVersion.createTime,
          rowHeight: DATE_SEPARATOR_HEIGHT,
        });
        processedCommits.push({
          type: rowType.FOLDED_COMMITS,
          rolledUpCommits: rolledUpVersions,
          date: firstRolledUpVersion.createTime,
          rowHeight: FOLDED_COMMITS_HEIGHT,
        });
      }
    }
  }
  return processedCommits;
};

const identifyCommitType = (commit: mainlineCommits["versions"][0]) => {
  if (commit.version) {
    return rowType.COMMIT;
  }
  if (commit.rolledUpVersions) {
    return rowType.FOLDED_COMMITS;
  }
};

// takes in 2 dates and returns if the dates are the same day
const isSameDay = (date1: string | Date, date2: string | Date) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const toggleRowSizeAtIndex = (
  processedCommits: CommitRowType[],
  numCommits: number,
  idx: number
): CommitRowType[] => {
  const newCommits = [...processedCommits];
  const expandedHeight = FOLDED_COMMITS_HEIGHT + COMMIT_HEIGHT * numCommits;
  const collapsedHeight = FOLDED_COMMITS_HEIGHT;

  // If size does not equal expandedHeight, that means it can be expanded. Otherwise it should be collapsed.
  if (newCommits[idx].rowHeight !== expandedHeight) {
    newCommits[idx].rowHeight = expandedHeight;
  } else {
    newCommits[idx].rowHeight = collapsedHeight;
  }
  return newCommits;
};
