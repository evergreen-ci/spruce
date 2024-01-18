import { Unpacked } from "types/utils";
import { COLUMN_LABEL_WIDTH, ROW_LABEL_WIDTH } from "./constants";
import { mainlineCommits, CommitRowType, rowType } from "./types";

// Processed commits are the order of commits in the table.
// They are one of the following:
// - A commit
// - A date separator
// - A set of commits that are rolled up into a single commit
// The processed commits are used to calculate the height of each row in the table.
// They are ordered by the order of the commits in the table.
export const processCommits = ({
  existingCommits,
  newCommits,
  selectedCommitOrder,
}: {
  newCommits: mainlineCommits["versions"];
  existingCommits: CommitRowType[];
  selectedCommitOrder: number | null;
}) => {
  let selectedCommitRowIndex: number | null = null;
  const processedCommits: CommitRowType[] = [...existingCommits];
  for (let i = 0; i < newCommits.length; i++) {
    const commit = newCommits[i];
    const commitType = identifyCommitType(commit);
    const priorCommit =
      processedCommits.length > 0
        ? processedCommits[processedCommits.length - 1]
        : null;

    switch (commitType) {
      case rowType.COMMIT: {
        const { version } = commit;
        const selected = version.order === selectedCommitOrder;
        if (priorCommit && isSameDay(version.createTime, priorCommit.date)) {
          processedCommits.push({
            type: rowType.COMMIT,
            commit: version,
            date: version.createTime,
            selected,
          });
        } else {
          processedCommits.push({
            type: rowType.DATE_SEPARATOR,
            date: version.createTime,
          });
          processedCommits.push({
            type: rowType.COMMIT,
            commit: version,
            date: version.createTime,
            selected,
          });
        }
        if (selected) {
          selectedCommitRowIndex = processedCommits.length - 1;
        }
        break;
      }
      case rowType.FOLDED_COMMITS: {
        const { rolledUpVersions } = commit;
        const firstRolledUpVersion = rolledUpVersions[0];
        const selected = hasSelectedCommit(
          rolledUpVersions,
          selectedCommitOrder,
        );
        if (
          priorCommit &&
          isSameDay(firstRolledUpVersion.createTime, priorCommit.date)
        ) {
          processedCommits.push({
            type: rowType.FOLDED_COMMITS,
            rolledUpCommits: rolledUpVersions,
            date: firstRolledUpVersion.createTime,
            selected,
            expanded: false,
          });
        } else {
          processedCommits.push({
            type: rowType.DATE_SEPARATOR,
            date: firstRolledUpVersion.createTime,
          });
          processedCommits.push({
            type: rowType.FOLDED_COMMITS,
            rolledUpCommits: rolledUpVersions,
            date: firstRolledUpVersion.createTime,
            selected,
            expanded: false,
          });
        }
        if (selected) {
          selectedCommitRowIndex = processedCommits.length - 1;
        }
        break;
      }
      default: {
        throw new Error(`Unknown commit type: ${commitType}`);
      }
    }
  }

  return { processedCommits, selectedCommitRowIndex };
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

const hasSelectedCommit = (
  rolledUpUpVersions: Unpacked<mainlineCommits["versions"]>["rolledUpVersions"],
  selectedCommitOrder: number | null,
) => {
  if (selectedCommitOrder === null) {
    return false;
  }
  return rolledUpUpVersions.some(
    (version) => version.order === selectedCommitOrder,
  );
};

export const calcColumnLimitFromWidth = (tableWidth: number) => {
  const colLimit = Math.floor(
    (tableWidth - ROW_LABEL_WIDTH) / COLUMN_LABEL_WIDTH,
  );
  return Math.max(colLimit, 1);
};
