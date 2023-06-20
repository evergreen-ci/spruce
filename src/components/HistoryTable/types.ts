import { MainlineCommitsForHistoryQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

export interface FoldedCommitsRow {
  type: rowType.FOLDED_COMMITS;
  rolledUpCommits: Unpacked<mainlineCommits["versions"]>["rolledUpVersions"];
  date: Date;
  selected: boolean;
  expanded: boolean;
}

export interface DateSeparatorRow {
  type: rowType.DATE_SEPARATOR;
  date: Date;
  selected?: boolean;
}

export interface CommitRow {
  type: rowType.COMMIT;
  commit: Unpacked<mainlineCommits["versions"]>["version"];
  date: Date;
  selected: boolean;
}

export type CommitRowType = FoldedCommitsRow | DateSeparatorRow | CommitRow;

export type mainlineCommits = MainlineCommitsForHistoryQuery["mainlineCommits"];

export enum rowType {
  FOLDED_COMMITS,
  DATE_SEPARATOR,
  COMMIT,
}
