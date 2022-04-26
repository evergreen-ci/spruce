import { PatchTasksQueryParams } from "types/task";

export const commitQueueAlias = "__commit_queue";
export const commitQueueRequester = "merge_test";

export const patchTasksQueryParams = [
  PatchTasksQueryParams.TaskName,
  PatchTasksQueryParams.Variant,
  PatchTasksQueryParams.Statuses,
  PatchTasksQueryParams.BaseStatuses,
  PatchTasksQueryParams.Sorts,
];

export const durationQueryParams = [
  PatchTasksQueryParams.TaskName,
  PatchTasksQueryParams.Variant,
  PatchTasksQueryParams.Sorts,
];
