import { mapTaskStatusToUmbrellaStatus } from "constants/task";

export const groupTasksByUmbrellaStatus = (tasks: { status: string }[]) => {
  const result: {
    [key: string]: {
      count: number;
      statuses: { [key: string]: number };
    };
  } = {};
  tasks.forEach((task) => {
    const umbrellaStatus = mapTaskStatusToUmbrellaStatus[task.status];
    if (result[umbrellaStatus]) {
      result[umbrellaStatus].count += 1;
    } else {
      result[umbrellaStatus] = {
        count: 1,
        statuses: {},
      };
    }
    const statusCounts = result[umbrellaStatus].statuses;
    if (statusCounts[task.status]) {
      statusCounts[task.status] += 1;
    } else {
      statusCounts[task.status] = 1;
    }
  });
  return result;
};
