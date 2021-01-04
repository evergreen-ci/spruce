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
}

export const ALL_PATCH_STATUS = "all";
