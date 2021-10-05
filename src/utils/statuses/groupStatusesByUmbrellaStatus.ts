import {
  taskStatusToCopy,
  mapTaskStatusToUmbrellaStatus,
  mapUmbrellaStatusColors,
  sortedUmbrellaStatus,
} from "constants/task";

type ColorCount = {
  count: number;
  statuses: string[];
  color: string;
  umbrellaStatus: string;
};

export const groupStatusesByUmbrellaStatus = (
  statusCounts: { status: string; count: number }[]
) => {
  const counts: { [key: string]: ColorCount } = {};

  statusCounts.forEach((stat) => {
    const umbrellaStatus = mapTaskStatusToUmbrellaStatus[stat.status];
    if (counts[umbrellaStatus]) {
      counts[umbrellaStatus].count += stat.count;
      if (!counts[umbrellaStatus].statuses.includes(stat.status)) {
        counts[umbrellaStatus].statuses.push(taskStatusToCopy[stat.status]);
      }
    } else {
      counts[umbrellaStatus] = {
        count: stat.count,
        statuses: [taskStatusToCopy[stat.status]],
        color: mapUmbrellaStatusColors[umbrellaStatus].barChart,
        umbrellaStatus,
      };
    }
  });

  let max = -1;
  let total = 0;
  const stats: ColorCount[] = [];

  // Populate STATS array with ColorCount object in sorted color order
  sortedUmbrellaStatus.forEach((umbrellaStatus) => {
    if (counts[umbrellaStatus]) {
      total += counts[umbrellaStatus].count;
      max = Math.max(max, counts[umbrellaStatus].count);
      stats.push(counts[umbrellaStatus]);
    }
  });

  return { stats, max, total };
};
