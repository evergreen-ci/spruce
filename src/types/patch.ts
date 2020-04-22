export enum MyPatchesQueryParams {
  CommitQueue = "commitQueue",
  PatchName = "patchName",
  Statuses = "statuses",
}

export enum PatchStatus {
  Created = "created",
  Started = "started",
  Success = "succeeded",
  Failed = "failed",
  All = "all",
}
