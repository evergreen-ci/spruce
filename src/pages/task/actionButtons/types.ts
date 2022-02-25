import { GetBaseVersionAndTaskQuery } from "gql/generated/types";

export enum CommitType {
  Base = "base",
  LastPassing = "lastPassing",
  LastExecuted = "lastExecuted",
}

export type CommitTask = GetBaseVersionAndTaskQuery["task"]["baseTask"];
