import {
  BaseVersionAndTaskQuery,
  LastMainlineCommitQuery,
} from "gql/generated/types";

export enum CommitType {
  Base = "base",
  LastPassing = "lastPassing",
  Breaking = "breaking",
  LastExecuted = "lastExecuted",
}

export type BaseTask = BaseVersionAndTaskQuery["task"]["baseTask"];

export type CommitTask =
  LastMainlineCommitQuery["mainlineCommits"]["versions"][number]["version"]["buildVariants"][number]["tasks"][number];
