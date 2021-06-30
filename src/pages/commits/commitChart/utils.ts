import { mapTaskStatusToColor, sortedTaskColor } from "constants/task";
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
  sortedTaskColor.forEach((color) => {
    counts[color] = {
      count: 0,
      statuses: [],
    };
  });
  statusCounts.forEach((statusCount) => {
    const taskStatusToColor =
      mapTaskStatusToColor[TaskStatus[statusCount.status]];
    total += statusCount.count;
    const groupedTask = counts[taskStatusToColor];
    groupedTask.count += statusCount.count;
    max = Math.max(max, groupedTask.count);
    if (!groupedTask.statuses.includes(statusCount.status)) {
      groupedTask.statuses.push(statusCount.status);
    }
  });

  return { stats: counts, max, total };
};
