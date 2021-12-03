import { failedTaskStatuses, TaskStatus } from "types/task";

export const isFailedTaskStatus = (taskStatus: string) =>
  failedTaskStatuses.includes(taskStatus as TaskStatus);
