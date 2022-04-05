import { MainlineCommitsQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

export enum ProjectFilterOptions {
  BuildVariant = "buildVariants",
  Task = "taskNames",
  Status = "statuses",
  Test = "tests",
}

export enum ChartToggleQueryParams {
  chartType = "chartType",
}

export enum MainlineCommitQueryParams {
  Requester = "requester",
  SkipOrderNumber = "skipOrderNumber",
}

export enum ChartTypes {
  Absolute = "absolute",
  Percentage = "percentage",
}

export enum CommitRequesterTypes {
  RepotrackerVersionRequester = "gitter_request",
  TriggerRequester = "trigger_request",
  GitTagRequester = "git_tag_request",
}

export type Commits = MainlineCommitsQuery["mainlineCommits"]["versions"];
export type Commit = Unpacked<Commits>;
export type CommitVersion = Commit["version"];
export type CommitRolledUpVersions = Commit["rolledUpVersions"];
export type BuildVariantDict = {
  [key: string]: {
    priority: number;
    iconHeight: number;
    cardHeight: number;
  };
};
