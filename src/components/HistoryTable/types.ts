import { MainlineCommitsForHistoryQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

export type CommitRowType =
  | {
      type: rowType.FOLDED_COMMITS;
      rolledUpCommits: Unpacked<
        mainlineCommits["versions"]
      >["rolledUpVersions"];
      date: Date;
      selected: boolean;
      open: boolean;
    }
  | {
      type: rowType.DATE_SEPARATOR;
      date: Date;
      selected?: boolean;
    }
  | {
      type: rowType.COMMIT;
      commit: Unpacked<mainlineCommits["versions"]>["version"];
      date: Date;
      selected: boolean;
    };

export type mainlineCommits = MainlineCommitsForHistoryQuery["mainlineCommits"];

export enum rowType {
  FOLDED_COMMITS,
  DATE_SEPARATOR,
  COMMIT,
}
