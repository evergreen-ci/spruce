export enum MyPatchesQueryParams {
  CommitQueue = "commitQueue",
  PatchName = "patchName",
  Statuses = "statuses",
}
export interface ModuleCodeChanges {
  branchName: string;
  htmlLink: string;
  rawLink: string;
  fileDiffs: FileDiff[];
}
export interface FileDiff {
  fileName: string;
  diffLink: string;
  additions: number;
  deletions: number;
}
export interface Patch {
  id: string;
  description: string;
  projectID: string;
  githash: string;
  patchNumber: number;
  author: string;
  version: string;
  status: string;
  activated: string;
  alias: string;
  taskCount: string;
  duration: {
    makespan: string;
    timeTaken: string;
  };
  time: {
    started?: string;
    finished?: string;
    submittedAt: string;
  };
  moduleCodeChanges: [ModuleCodeChanges];
}

export enum PatchStatus {
  Created = "created",
  Failed = "failed",
  Started = "started",
  Success = "succeeded",
}

export const ALL_PATCH_STATUS = "all";
