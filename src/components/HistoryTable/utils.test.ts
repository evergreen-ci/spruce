import { mainlineCommitData } from "./testData";
import { rowType } from "./types";
import { processCommits } from "./utils";

describe("historyTable utils", () => {
  describe("processCommits", () => {
    it("should return empty array if no commits", () => {
      const result = processCommits([], [], null);
      expect(result).toStrictEqual([]);
    });

    it("should handle adding new commits when none exist", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const result = processCommits([firstCommit], [], null);
      expect(result).toStrictEqual([
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
      it("should not seperate commits when they subsequent commits are of the same date", () => {
        const result = processCommits([firstCommit, secondCommit], [], null);
        expect(result).toStrictEqual([
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
      it("should seperate commits when they are not of the same date", () => {
        const result = processCommits([firstCommit, thirdCommit], [], null);
        expect(result).toStrictEqual([
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
        const result = processCommits([foldedUpCommits], [], null);
        expect(result).toStrictEqual([
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
      it("should add a folded up commit when there are prior commits", () => {
        const result = processCommits(
          [foldedUpCommits],
          [
            {
              date: firstCommit.version.createTime,
              type: rowType.DATE_SEPARATOR,
              selected: false,
            },
            {
              commit: firstCommit.version,
              date: firstCommit.version.createTime,
              type: rowType.COMMIT,
              selected: false,
            },
          ],
          null
        );
        expect(result).toStrictEqual([
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
