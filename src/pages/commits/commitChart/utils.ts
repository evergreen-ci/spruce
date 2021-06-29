import { mapTaskStatusToColor } from "constants/task";
import { TaskStatus } from "types/task";

export type GroupedResult = {
  stats: {
    [key: string]: { count: number; statuses: string[] };
  };
  max: number;
  total: number;
};

export const groupTasksByColor = (
  statusCounts: { status: string; count: number }[]
) => {
  let max = -1;
  let total = 0;
  const counts: {
    [key: string]: { count: number; statuses: string[] };
  } = {};
  statusCounts.forEach((statusCount) => {
    const taskStatusToColor =
      mapTaskStatusToColor[TaskStatus[statusCount.status]];
    total += statusCount.count;
    if (counts[taskStatusToColor]) {
      const groupedTask = counts[taskStatusToColor];
      groupedTask.count += statusCount.count;
      max = Math.max(max, groupedTask.count);
      if (!groupedTask.statuses.includes(statusCount.status)) {
        groupedTask.statuses.push(statusCount.status);
      }
    } else {
      counts[taskStatusToColor] = {
        count: statusCount.count,
        statuses: [statusCount.status],
      };
      max = Math.max(max, statusCount.count);
    }
  });

  // make sure it is sorted
  const result = { stats: counts, max, total };
  return result;
};
