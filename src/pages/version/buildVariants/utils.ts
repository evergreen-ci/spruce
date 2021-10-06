import { mapTaskStatusToUmbrellaStatus } from "constants/task";

export const groupTasksByUmbrellaStatus = (tasks: { status: string }[]) => {
  const result: {
    [key: string]: {
      count: number;
      statuses: string[];
    };
  } = {};
  tasks.forEach((task) => {
    const umbrellaStatus = mapTaskStatusToUmbrellaStatus[task.status];
    if (result[umbrellaStatus]) {
      const groupedTask = result[umbrellaStatus];
      groupedTask.count += 1;
      if (!groupedTask.statuses.includes(task.status)) {
        groupedTask.statuses.push(task.status);
      }
    } else {
      result[umbrellaStatus] = {
        count: 1,
        statuses: [task.status],
      };
    }
  });
  return result;
};
