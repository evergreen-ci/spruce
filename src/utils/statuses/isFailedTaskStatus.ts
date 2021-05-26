import { TaskStatus } from "types/task";

export const isFailedTaskStatus = (taskStatus: string) =>
  taskStatus === TaskStatus.Failed ||
  taskStatus === TaskStatus.SetupFailed ||
  taskStatus === TaskStatus.SystemFailed ||
  taskStatus === TaskStatus.TaskTimedOut ||
  taskStatus === TaskStatus.TestTimedOut ||
  taskStatus === TaskStatus.KnownIssue;
