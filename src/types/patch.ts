export enum MyPatchesQueryParams {
  CommitQueue = "commitQueue",
  PatchName = "patchName",
  Statuses = "statuses",
  Page = "page",
  Limit = "limit",
}

export enum PatchStatus {
  Created = "created",
  Failed = "failed",
  Started = "started",
  Success = "succeeded",
  Aborted = "aborted",
}

export enum PatchTab {
  Tasks = "tasks",
  Changes = "changes",
  Parameters = "parameters",
  DownstreamTasks = "downstream-tasks",
  Configure = "configure",
}

export const ALL_PATCH_STATUS = "all";
