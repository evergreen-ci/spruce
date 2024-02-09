import { BaseVersionAndTaskQuery } from "gql/generated/types";

export enum CommitType {
  Base = "base",
  LastPassing = "lastPassing",
  Breaking = "breaking",
  LastExecuted = "lastExecuted",
}

export type CommitTask = BaseVersionAndTaskQuery["task"]["baseTask"];
