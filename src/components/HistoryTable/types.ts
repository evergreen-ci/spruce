import { MainlineCommitsForHistoryQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

export type CommitRowType =
  | {
      type: rowType.FOLDED_COMMITS;
      rolledUpCommits: Unpacked<
        mainlineCommits["versions"]
      >["rolledUpVersions"];
      rowHeight: number;
      date: Date;
      selected: boolean;
      expanded: boolean;
    }
  | {
      type: rowType.DATE_SEPARATOR;
      date: Date;
      rowHeight: number;
      selected: boolean;
    }
  | {
      type: rowType.COMMIT;
      commit: Unpacked<mainlineCommits["versions"]>["version"];
      date: Date;
      selected: boolean;
      rowHeight: number;
    };

export type mainlineCommits = MainlineCommitsForHistoryQuery["mainlineCommits"];

export enum rowType {
  FOLDED_COMMITS,
  DATE_SEPARATOR,
  COMMIT,
}
