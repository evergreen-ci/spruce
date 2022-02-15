import { failedTaskStatuses, finishedTaskStatuses } from "constants/task";
import { TaskStatus } from "types/task";
import { getCurrentStatuses } from "./getCurrentStatuses";
import { getStatusBadgeCopy } from "./getStatusBadgeCopy";
import { groupStatusesByUmbrellaStatus } from "./groupStatusesByUmbrellaStatus";
import { sortTasks } from "./sort";

export {
  getStatusBadgeCopy,
  sortTasks,
  groupStatusesByUmbrellaStatus,
  getCurrentStatuses,
};

export const isFinishedTaskStatus = (status: string): boolean =>
  finishedTaskStatuses.includes(status as TaskStatus);

export const isFailedTaskStatus = (taskStatus: string) =>
  failedTaskStatuses.includes(taskStatus as TaskStatus);
