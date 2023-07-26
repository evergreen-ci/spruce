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
        existingCommits: [],
        newCommits: [],
        selectedCommitOrder: null,
      });
      expect(processedCommits).toStrictEqual([]);
    });

    it("should handle adding new commits when none exist", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const { processedCommits } = processCommits({
        existingCommits: [],
        newCommits: [firstCommit],
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
          selected: false,
          type: rowType.COMMIT,
        },
      ]);
    });

    describe("should support adding new commits when they already exist", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const secondCommit = mainlineCommitData.versions[1];
      const thirdCommit = mainlineCommitData.versions[2];
      it("should not seperate commits when they subsequent commits are of the same date", () => {
        const { processedCommits } = processCommits({
          existingCommits: [],
          newCommits: [firstCommit, secondCommit],
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
            selected: false,
            type: rowType.COMMIT,
          },
          {
            commit: secondCommit.version,
            date: secondCommit.version.createTime,
            selected: false,
            type: rowType.COMMIT,
          },
        ]);
      });
      it("should seperate commits when they are not of the same date", () => {
        const { processedCommits } = processCommits({
          existingCommits: [],
          newCommits: [firstCommit, thirdCommit],
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
            selected: false,
            type: rowType.COMMIT,
          },
          {
            date: thirdCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            commit: thirdCommit.version,
            date: thirdCommit.version.createTime,
            selected: false,
            type: rowType.COMMIT,
          },
        ]);
      });
    });

    describe("should support adding folded up commits", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const foldedUpCommits = mainlineCommitData.versions[5];
      it("should add a folded up commit when it is the first commit", () => {
        const { processedCommits } = processCommits({
          existingCommits: [],
          newCommits: [foldedUpCommits],
          selectedCommitOrder: null,
        });
        expect(processedCommits).toStrictEqual<CommitRowType[]>([
          {
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            expanded: false,
            rolledUpCommits: foldedUpCommits.rolledUpVersions,
            selected: false,
            type: rowType.FOLDED_COMMITS,
          },
        ]);
      });
      it("should add a folded up commit when there are prior commits", () => {
        const { processedCommits } = processCommits({
          existingCommits: [
            {
              date: firstCommit.version.createTime,
              type: rowType.DATE_SEPARATOR,
            },
            {
              commit: firstCommit.version,
              date: firstCommit.version.createTime,
              selected: false,
              type: rowType.COMMIT,
            },
          ],
          newCommits: [foldedUpCommits],
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
            selected: false,
            type: rowType.COMMIT,
          },
          {
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            expanded: false,
            rolledUpCommits: foldedUpCommits.rolledUpVersions,
            selected: false,
            type: rowType.FOLDED_COMMITS,
          },
        ]);
      });
    });

    describe("selected commits", () => {
      it("should return the correct row number for selected commits", () => {
        const { processedCommits, selectedCommitRowIndex } = processCommits({
          existingCommits: [],
          newCommits: [mainlineCommitData.versions[0]],
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
            selected: true,
            type: rowType.COMMIT,
          },
        ]);
        expect(selectedCommitRowIndex).toBe(1);
      });
      it("should not return a selected commit if it does not exist", () => {
        const { processedCommits, selectedCommitRowIndex } = processCommits({
          existingCommits: [],
          newCommits: [mainlineCommitData.versions[0]],
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
