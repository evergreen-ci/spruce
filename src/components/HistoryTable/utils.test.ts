import { mainlineCommitData } from "./testData";
import { processCommits, rowType } from "./utils";

describe("HistoryTable utils", () => {
  describe("processCommits", () => {
    test("should return empty array if no commits", () => {
      const result = processCommits([], []);
      expect(result).toEqual([]);
    });

    test("should handle adding new commits when none exist", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const result = processCommits([firstCommit], []);
      expect(result).toEqual([
        {
          date: firstCommit.version.createTime,
          type: rowType.DATE_SEPARATOR,
        },
        {
          commit: firstCommit.version,
          date: firstCommit.version.createTime,
          type: rowType.COMMIT,
        },
      ]);
    });
    describe("should support adding new commits when they already exist", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const secondCommit = mainlineCommitData.versions[1];
      const thirdCommit = mainlineCommitData.versions[2];
      test("should not seperate commits when they subsequent commits are of the same date", () => {
        const result = processCommits([firstCommit, secondCommit], []);
        expect(result).toEqual([
          {
            date: firstCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            commit: firstCommit.version,
            date: firstCommit.version.createTime,
            type: rowType.COMMIT,
          },
          {
            commit: secondCommit.version,
            date: secondCommit.version.createTime,
            type: rowType.COMMIT,
          },
        ]);
      });
      test("should seperate commits when they are not of the same date", () => {
        const result = processCommits([firstCommit, thirdCommit], []);
        expect(result).toEqual([
          {
            date: firstCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            commit: firstCommit.version,
            date: firstCommit.version.createTime,
            type: rowType.COMMIT,
          },
          {
            date: thirdCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            commit: thirdCommit.version,
            date: thirdCommit.version.createTime,
            type: rowType.COMMIT,
          },
        ]);
      });
    });
    describe("should support adding folded up commits", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const foldedUpCommits = mainlineCommitData.versions[5];
      test("should add a folded up commit when it is the first commit", () => {
        const result = processCommits([foldedUpCommits], []);
        expect(result).toEqual([
          {
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            rolledUpCommits: foldedUpCommits.rolledUpVersions,
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.FOLDED_COMMITS,
          },
        ]);
      });
      test("should add a folded up commit when there are prior commits", () => {
        const result = processCommits(
          [foldedUpCommits],
          [
            {
              date: firstCommit.version.createTime,
              type: rowType.DATE_SEPARATOR,
            },
            {
              commit: firstCommit.version,
              date: firstCommit.version.createTime,
              type: rowType.COMMIT,
            },
          ]
        );
        expect(result).toEqual([
          {
            date: firstCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            commit: firstCommit.version,
            date: firstCommit.version.createTime,
            type: rowType.COMMIT,
          },
          {
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.DATE_SEPARATOR,
          },
          {
            rolledUpCommits: foldedUpCommits.rolledUpVersions,
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.FOLDED_COMMITS,
          },
        ]);
      });
    });
  });
});
