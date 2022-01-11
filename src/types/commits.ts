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
  SkipOrderNumber = "skipOrderNumber",
  Requester = "requester",
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
