import { mainlineCommitData } from "./testData";
import { rowType, CommitRowType } from "./types";
import { calcColumnLimitFromWidth, processCommits } from "./utils";

describe("historyTable utils", () => {
  describe("calcColumnLimitFromWidth", () => {
    it("should return the number of columns to display in the history table based on the provided width", () => {
      expect(calcColumnLimitFromWidth(-100)).toBe(1);
      expect(calcColumnLimitFromWidth(2800)).toBe(17);
      expect(calcColumnLimitFromWidth(2850)).toBe(17);
      expect(calcColumnLimitFromWidth(4000)).toBe(25);
    });
  });

  describe("processCommits", () => {
    it("should return empty array if no commits", () => {
      const { processedCommits } = processCommits({
        newCommits: [],
        existingCommits: [],
        selectedCommitOrder: null,
      });
      expect(processedCommits).toStrictEqual([]);
    });

    it("should handle adding new commits when none exist", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const { processedCommits } = processCommits({
        newCommits: [firstCommit],
        existingCommits: [],
        selectedCommitOrder: null,
      });
      expect(processedCommits).toStrictEqual<CommitRowType[]>([
        {
          date: firstCommit.version.createTime,
          type: rowType.DATE_SEPARATOR,
        },
        {
          commit: firstCommit.version,
          date: firstCommit.version.createTime,
          type: rowType.COMMIT,
          selected: false,
        },
      ]);
    });

    describe("should support adding new commits when they already exist", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const secondCommit = mainlineCommitData.versions[1];
      const thirdCommit = mainlineCommitData.versions[2];
      it("should not seperate commits when they subsequent commits are of the same date", () => {
        const { processedCommits } = processCommits({
          newCommits: [firstCommit, secondCommit],
          existingCommits: [],
          selectedCommitOrder: null,
        });
        expect(processedCommits).toStrictEqual<CommitRowType[]>([
          {
            date: firstCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            commit: firstCommit.version,
            date: firstCommit.version.createTime,
            type: rowType.COMMIT,
            selected: false,
          },
          {
            commit: secondCommit.version,
            date: secondCommit.version.createTime,
            type: rowType.COMMIT,
            selected: false,
          },
        ]);
      });
      it("should seperate commits when they are not of the same date", () => {
        const { processedCommits } = processCommits({
          newCommits: [firstCommit, thirdCommit],
          existingCommits: [],
          selectedCommitOrder: null,
        });
        expect(processedCommits).toStrictEqual<CommitRowType[]>([
          {
            date: firstCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            commit: firstCommit.version,
            date: firstCommit.version.createTime,
            type: rowType.COMMIT,
            selected: false,
          },
          {
            date: thirdCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            commit: thirdCommit.version,
            date: thirdCommit.version.createTime,
            type: rowType.COMMIT,
            selected: false,
          },
        ]);
      });
    });

    describe("should support adding folded up commits", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const foldedUpCommits = mainlineCommitData.versions[5];
      it("should add a folded up commit when it is the first commit", () => {
        const { processedCommits } = processCommits({
          newCommits: [foldedUpCommits],
          existingCommits: [],
          selectedCommitOrder: null,
        });
        expect(processedCommits).toStrictEqual<CommitRowType[]>([
          {
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            rolledUpCommits: foldedUpCommits.rolledUpVersions,
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.FOLDED_COMMITS,
            selected: false,
            expanded: false,
          },
        ]);
      });
      it("should add a folded up commit when there are prior commits", () => {
        const { processedCommits } = processCommits({
          newCommits: [foldedUpCommits],
          existingCommits: [
            {
              date: firstCommit.version.createTime,
              type: rowType.DATE_SEPARATOR,
            },
            {
              commit: firstCommit.version,
              date: firstCommit.version.createTime,
              type: rowType.COMMIT,
              selected: false,
            },
          ],
          selectedCommitOrder: null,
        });
        expect(processedCommits).toStrictEqual<CommitRowType[]>([
          {
            date: firstCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            commit: firstCommit.version,
            date: firstCommit.version.createTime,
            type: rowType.COMMIT,
            selected: false,
          },
          {
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            rolledUpCommits: foldedUpCommits.rolledUpVersions,
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.FOLDED_COMMITS,
            selected: false,
            expanded: false,
          },
        ]);
      });
    });

    describe("selected commits", () => {
      it("should return the correct row number for selected commits", () => {
        const { processedCommits, selectedCommitRowIndex } = processCommits({
          newCommits: [mainlineCommitData.versions[0]],
          existingCommits: [],
          selectedCommitOrder: 3399,
        });
        expect(processedCommits).toStrictEqual([
          {
            date: mainlineCommitData.versions[0].version.createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            commit: mainlineCommitData.versions[0].version,
            date: mainlineCommitData.versions[0].version.createTime,
            type: rowType.COMMIT,
            selected: true,
          },
        ]);
        expect(selectedCommitRowIndex).toBe(1);
      });
      it("should not return a selected commit if it does not exist", () => {
        const { processedCommits, selectedCommitRowIndex } = processCommits({
          newCommits: [mainlineCommitData.versions[0]],
          existingCommits: [],
          selectedCommitOrder: 1996,
        });
        expect(processedCommits).toStrictEqual([
          {
            date: mainlineCommitData.versions[0].version.createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            commit: mainlineCommitData.versions[0].version,
            date: mainlineCommitData.versions[0].version.createTime,
            type: rowType.COMMIT,

            selected: false,
          },
        ]);
        expect(selectedCommitRowIndex).toBeNull();
      });
    });
  });
});
