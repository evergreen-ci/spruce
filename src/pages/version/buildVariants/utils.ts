import { mapTaskStatusToColor, mapTaskStatusToTextColor } from "constants/task";

export const groupTasksByColor = (tasks: { status: string }[]) => {
  const result: {
    [key: string]: { count: number; statuses: string[]; textColor: string };
  } = {};
  tasks.forEach((task) => {
    const taskStatusToColor = mapTaskStatusToColor[task.status];
    if (result[taskStatusToColor]) {
      const groupedTask = result[taskStatusToColor];
      groupedTask.count += 1;
      if (!groupedTask.statuses.includes(task.status)) {
        groupedTask.statuses.push(task.status);
      }
    } else {
      result[taskStatusToColor] = {
        count: 1,
        statuses: [task.status],
        textColor: mapTaskStatusToTextColor[task.status],
      };
    }
  });
  return result;
};
