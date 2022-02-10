import { mapTaskStatusToUmbrellaStatus } from "constants/task";

export const groupTaskStatsByUmbrellaStatus = (
  stats: { status: string; count: number }[]
) => {
  const result: {
    [key: string]: {
      count: number;
      statuses: { [key: string]: number };
    };
  } = {};
  stats.forEach((stat) => {
    const umbrellaStatus = mapTaskStatusToUmbrellaStatus[stat.status];
    if (result[umbrellaStatus]) {
      result[umbrellaStatus].count += stat.count;
    } else {
      result[umbrellaStatus] = {
        count: stat.count,
        statuses: {},
      };
    }
    const statusCounts = result[umbrellaStatus].statuses;
    if (statusCounts[stat.status]) {
      statusCounts[stat.status] += stat.count;
    } else {
      statusCounts[stat.status] = stat.count;
    }
  });
  return result;
};
