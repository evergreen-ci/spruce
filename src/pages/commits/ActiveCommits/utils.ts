import { mapTaskStatusToColor, sortedStatusColor } from "constants/task";
import { MainlineCommitsQuery } from "gql/generated/types";

export type GroupedResult = {
  stats: {
    [key: string]: { count: number; statuses: string[] };
  };
  max: number;
  total: number;
};

export const groupStatusesByColor = (
  statusCounts: { status: string; count: number }[]
) => {
  let max = -1;
  let total = 0;
  const counts: { [key: string]: { count: number; statuses: string[] } } = {};
  sortedStatusColor.forEach((color) => {
    counts[color] = { count: 0, statuses: [] };
  });

  statusCounts.forEach((statusCount) => {
    const taskStatusToColor = mapTaskStatusToColor[statusCount.status];
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

export const findMaxGroupedTaskStats = (groupedTaskStats: {
  [id: string]: GroupedResult;
}) =>
  Object.values(groupedTaskStats).reduce((prev, curr) =>
    prev.max > curr.max ? prev : curr
  );

export const getAllTaskStatsGroupedByColor = (
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"]
) => {
  const idToGroupedTaskStats: { [id: string]: GroupedResult } = {};
  versions.forEach((item) => {
    if (item.version != null) {
      idToGroupedTaskStats[item.version.id] = groupStatusesByColor(
        item.version.taskStatusCounts
      );
    }
  });

  return idToGroupedTaskStats;
};
