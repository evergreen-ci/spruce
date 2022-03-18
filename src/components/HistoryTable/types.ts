import { MainlineCommitsForHistoryQuery } from "gql/generated/types";

export type CommitRowType = {
  type: rowType;
  commit?: MainlineCommitsForHistoryQuery["mainlineCommits"]["versions"][0]["version"];
  rolledUpCommits?: MainlineCommitsForHistoryQuery["mainlineCommits"]["versions"][0]["rolledUpVersions"];
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
