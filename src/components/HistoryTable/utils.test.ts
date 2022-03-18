import {
  FOLDED_COMMITS_HEIGHT,
  COMMIT_HEIGHT,
  DATE_SEPARATOR_HEIGHT,
} from "./constants";
import { mainlineCommitData } from "./testData";
import { rowType, CommitRowType } from "./types";
import { processCommits } from "./utils";

describe("historyTable utils", () => {
  describe("processCommits", () => {
    it("should return empty array if no commits", () => {
      const { processedCommits } = processCommits([], [], null);
      expect(processedCommits).toStrictEqual([]);
    });

    it("should handle adding new commits when none exist", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const { processedCommits } = processCommits([firstCommit], [], null);
      expect(processedCommits).toStrictEqual<CommitRowType[]>([
        {
          date: firstCommit.version.createTime,
          type: rowType.DATE_SEPARATOR,
          rowHeight: DATE_SEPARATOR_HEIGHT,
          selected: false,
        },
        {
          commit: firstCommit.version,
          date: firstCommit.version.createTime,
          type: rowType.COMMIT,
          rowHeight: COMMIT_HEIGHT,
          selected: false,
        },
      ]);
    });
    describe("should support adding new commits when they already exist", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const secondCommit = mainlineCommitData.versions[1];
      const thirdCommit = mainlineCommitData.versions[2];
      it("should not seperate commits when they subsequent commits are of the same date", () => {
        const { processedCommits } = processCommits(
          [firstCommit, secondCommit],
          [],
          null
        );
        expect(processedCommits).toStrictEqual<CommitRowType[]>([
          {
            date: firstCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
            rowHeight: DATE_SEPARATOR_HEIGHT,
            selected: false,
          },
          {
            commit: firstCommit.version,
            date: firstCommit.version.createTime,
            type: rowType.COMMIT,
            rowHeight: COMMIT_HEIGHT,
            selected: false,
          },
          {
            commit: secondCommit.version,
            date: secondCommit.version.createTime,
            type: rowType.COMMIT,
            rowHeight: COMMIT_HEIGHT,
            selected: false,
          },
        ]);
      });
      it("should seperate commits when they are not of the same date", () => {
        const { processedCommits } = processCommits(
          [firstCommit, thirdCommit],
          [],
          null
        );
        expect(processedCommits).toStrictEqual<CommitRowType[]>([
          {
            date: firstCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
            rowHeight: DATE_SEPARATOR_HEIGHT,
            selected: false,
          },
          {
            commit: firstCommit.version,
            date: firstCommit.version.createTime,
            type: rowType.COMMIT,
            selected: false,
            rowHeight: COMMIT_HEIGHT,
          },
          {
            date: thirdCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
            rowHeight: DATE_SEPARATOR_HEIGHT,
            selected: false,
          },
          {
            commit: thirdCommit.version,
            date: thirdCommit.version.createTime,
            type: rowType.COMMIT,
            selected: false,
            rowHeight: COMMIT_HEIGHT,
          },
        ]);
      });
    });
    describe("should support adding folded up commits", () => {
      const firstCommit = mainlineCommitData.versions[0];
      const foldedUpCommits = mainlineCommitData.versions[5];
      it("should add a folded up commit when it is the first commit", () => {
        const { processedCommits } = processCommits(
          [foldedUpCommits],
          [],
          null
        );
        expect(processedCommits).toStrictEqual<CommitRowType[]>([
          {
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.DATE_SEPARATOR,
            rowHeight: DATE_SEPARATOR_HEIGHT,
            selected: false,
          },
          {
            rolledUpCommits: foldedUpCommits.rolledUpVersions,
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.FOLDED_COMMITS,
            rowHeight: FOLDED_COMMITS_HEIGHT,
            selected: false,
          },
        ]);
      });
      it("should add a folded up commit when there are prior commits", () => {
        const { processedCommits } = processCommits(
          [foldedUpCommits],
          [
            {
              date: firstCommit.version.createTime,
              type: rowType.DATE_SEPARATOR,
              rowHeight: DATE_SEPARATOR_HEIGHT,
              selected: false,
            },
            {
              commit: firstCommit.version,
              date: firstCommit.version.createTime,
              type: rowType.COMMIT,
              selected: false,
              rowHeight: COMMIT_HEIGHT,
            },
          ],
          null
        );
        expect(processedCommits).toStrictEqual<CommitRowType[]>([
          {
            date: firstCommit.version.createTime,
            type: rowType.DATE_SEPARATOR,
            rowHeight: DATE_SEPARATOR_HEIGHT,
            selected: false,
          },
          {
            commit: firstCommit.version,
            date: firstCommit.version.createTime,
            type: rowType.COMMIT,
            rowHeight: COMMIT_HEIGHT,
            selected: false,
          },
          {
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.DATE_SEPARATOR,
            rowHeight: DATE_SEPARATOR_HEIGHT,
            selected: false,
          },
          {
            rolledUpCommits: foldedUpCommits.rolledUpVersions,
            date: foldedUpCommits.rolledUpVersions[0].createTime,
            type: rowType.FOLDED_COMMITS,
            rowHeight: FOLDED_COMMITS_HEIGHT,
            selected: false,
          },
        ]);
      });
    });
  });
});
