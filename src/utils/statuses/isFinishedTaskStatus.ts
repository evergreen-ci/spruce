import { finishedTaskStatuses, TaskStatus } from "types/task";

export const isFinishedTaskStatus = (status: string): boolean =>
  finishedTaskStatuses.includes(status as TaskStatus);
