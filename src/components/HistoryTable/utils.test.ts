import {
  FOLDED_COMMITS_HEIGHT,
  COMMIT_HEIGHT,
  DATE_SEPARATOR_HEIGHT,
  DEFAULT_COLUMN_LIMIT,
} from "./constants";
import { mainlineCommitData } from "./testData";
import { rowType } from "./types";
import { calcColumnLimitFromWidth, processCommits } from "./utils";

describe("historyTable utils", () => {
  describe("calcColumnLimitFromWidth", () => {
    it("should not return a value below the default column limit", () => {
      expect(calcColumnLimitFromWidth(-100)).toStrictEqual(
        DEFAULT_COLUMN_LIMIT
      );
      expect(calcColumnLimitFromWidth(0)).toStrictEqual(DEFAULT_COLUMN_LIMIT);
      expect(calcColumnLimitFromWidth(800)).toStrictEqual(DEFAULT_COLUMN_LIMIT);
      expect(calcColumnLimitFromWidth(801)).toStrictEqual(DEFAULT_COLUMN_LIMIT);
    });
    it("should return the number of columns to display in the history table based on the provided width", () => {
      expect(calcColumnLimitFromWidth(2800)).toBe(17);
      expect(calcColumnLimitFromWidth(2850)).toBe(17);
      expect(calcColumnLimitFromWidth(4000)).toBe(25);
    });
  });
  describe("processCommits", () => {
    it("should return empty array if no commits", () => {
      const result = processCommits([], []);
      expect(result).toStrictEqual([]);
    });

    it("should handle adding new commits when none exist", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const result = processCommits([firstCommit], []);
      expect(result).toStrictEqual([
        {
          date: firstCommit.version.createTime,
          type: rowType.DATE_SEPARATOR,
          rowHeight: DATE_SEPARATOR_HEIGHT,
        },
        {
          commit: firstCommit.version,
          date: firstCommit.version.createTime,
          type: rowType.COMMIT,
          rowHeight: COMMIT_HEIGHT,
        },
      ]);
    });
    describe("should support adding new commits when they already exist", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const secondCommit = mainlineCommitData.versions[1];
      const thirdCommit = mainlineCommitData.versions[2];
      it("should not seperate commits when they subsequent commits are of the same date", () => {
        const result = processCommits([firstCommit, secondCommit], []);
        expect(result).toStrictEqual([
          {
            date: firstCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
            rowHeight: DATE_SEPARATOR_HEIGHT,
          },
          {
            commit: firstCommit.version,
            date: firstCommit.version.createTime,
            type: rowType.COMMIT,
            rowHeight: COMMIT_HEIGHT,
          },
          {
            commit: secondCommit.version,
            date: secondCommit.version.createTime,
            type: rowType.COMMIT,
            rowHeight: COMMIT_HEIGHT,
          },
        ]);
      });
      it("should seperate commits when they are not of the same date", () => {
        const result = processCommits([firstCommit, thirdCommit], []);
        expect(result).toStrictEqual([
          {
            date: firstCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
            rowHeight: DATE_SEPARATOR_HEIGHT,
          },
          {
            commit: firstCommit.version,
            date: firstCommit.version.createTime,
            type: rowType.COMMIT,
            rowHeight: COMMIT_HEIGHT,
          },
          {
            date: thirdCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
            rowHeight: DATE_SEPARATOR_HEIGHT,
          },
          {
            commit: thirdCommit.version,
            date: thirdCommit.version.createTime,
            type: rowType.COMMIT,
            rowHeight: COMMIT_HEIGHT,
          },
        ]);
      });
    });
    describe("should support adding folded up commits", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const foldedUpCommits = mainlineCommitData.versions[5];
      it("should add a folded up commit when it is the first commit", () => {
        const result = processCommits([foldedUpCommits], []);
        expect(result).toStrictEqual([
          {
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.DATE_SEPARATOR,
            rowHeight: DATE_SEPARATOR_HEIGHT,
          },
          {
            rolledUpCommits: foldedUpCommits.rolledUpVersions,
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.FOLDED_COMMITS,
            rowHeight: FOLDED_COMMITS_HEIGHT,
          },
        ]);
      });
      it("should add a folded up commit when there are prior commits", () => {
        const result = processCommits(
          [foldedUpCommits],
          [
            {
              date: firstCommit.version.createTime,
              type: rowType.DATE_SEPARATOR,
              rowHeight: DATE_SEPARATOR_HEIGHT,
            },
            {
              commit: firstCommit.version,
              date: firstCommit.version.createTime,
              type: rowType.COMMIT,
              rowHeight: COMMIT_HEIGHT,
            },
          ]
        );
        expect(result).toStrictEqual([
          {
            date: firstCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
            rowHeight: DATE_SEPARATOR_HEIGHT,
          },
          {
            commit: firstCommit.version,
            date: firstCommit.version.createTime,
            type: rowType.COMMIT,
            rowHeight: COMMIT_HEIGHT,
          },
          {
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.DATE_SEPARATOR,
            rowHeight: DATE_SEPARATOR_HEIGHT,
          },
          {
            rolledUpCommits: foldedUpCommits.rolledUpVersions,
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.FOLDED_COMMITS,
            rowHeight: FOLDED_COMMITS_HEIGHT,
          },
        ]);
      });
    });
  });
});
