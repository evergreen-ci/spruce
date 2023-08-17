export enum PatchPageQueryParams {
  CommitQueue = "commitQueue",
  PatchName = "patchName",
  Statuses = "statuses",
  Page = "page",
  Limit = "limit",
}

export enum PatchStatus {
  Unconfigured = "unconfigured",
  Created = "created",
  Failed = "failed",
  Started = "started",
  LegacySucceeded = "succeeded",
  Success = "success",
  Aborted = "aborted",
}

export enum PatchTab {
  Tasks = "tasks",
  Changes = "changes",
  Parameters = "parameters",
  Downstream = "downstream-projects",
  TaskDuration = "task-duration",
  Configure = "configure",
}

export const ALL_PATCH_STATUS = "all";
