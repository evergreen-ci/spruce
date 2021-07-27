import {
  mapTaskStatusToColor,
  sortedStatusColor,
  taskStatusToCopy,
  mapTaskStatusToUmbrellaStatus,
} from "constants/task";

type ColorCount = {
  count: number;
  statuses: string[];
  color: string;
  umbrellaStatus: string;
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
        counts[statusColor].statuses.push(taskStatusToCopy[stat.status]);
      }
    } else {
      counts[statusColor] = {
        count: stat.count,
        statuses: [taskStatusToCopy[stat.status]],
        color: statusColor,
        umbrellaStatus: mapTaskStatusToUmbrellaStatus[stat.status],
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
