import { mapTaskStatusToColor, sortedStatusColor } from "constants/task";
import { MainlineCommitsQuery } from "gql/generated/types";

export type ColorCount = { count: number; statuses: string[]; color: string };

export type GroupedResult = {
  stats: ColorCount[];
  max: number;
  total: number;
};

export const groupStatusesByColor = (
  statusCounts: { status: string; count: number }[]
) => {
  const counts: { [key: string]: ColorCount } = {};

  statusCounts.forEach((stat) => {
    const statusColor = mapTaskStatusToColor[stat.status];
    if (counts[statusColor]) {
      counts[statusColor].count += stat.count;
      if (!counts[statusColor].statuses.includes(stat.status)) {
        counts[statusColor].statuses.push(stat.status);
      }
    } else {
      counts[statusColor] = {
        count: stat.count,
        statuses: [stat.status],
        color: statusColor,
      };
    }
  });

  let max = -1;
  let total = 0;
  const stats: ColorCount[] = [];

  // Populate STATS array with ColorCount object in sorted color order
  sortedStatusColor.forEach((color) => {
    if (counts[color]) {
      total += counts[color].count;
      max = Math.max(max, counts[color].count);
      stats.push(counts[color]);
    }
  });

  return { stats, max, total };
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
  versions.forEach((versionObj) => {
    if (versionObj.version != null) {
      idToGroupedTaskStats[versionObj.version.id] = groupStatusesByColor(
        versionObj.version.taskStatusCounts
      );
    }
  });

  return idToGroupedTaskStats;
};
