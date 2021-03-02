import {
  mapVariantTaskStatusToColor,
  mapVariantTaskStatusToDarkColor,
} from "components/StatusSquare";

export const groupTasksByColor = (tasks: { status: string }[]) => {
  const taskColors: {
    [key: string]: { count: number; statuses: string[]; textColor: string };
  } = {};
  tasks.forEach((task) => {
    const taskStatusToColor = mapVariantTaskStatusToColor[task.status];
    if (taskColors[taskStatusToColor]) {
      taskColors[taskStatusToColor].count += 1;
      if (!taskColors[taskStatusToColor].statuses.includes(task.status)) {
        taskColors[taskStatusToColor].statuses = [
          ...taskColors[taskStatusToColor].statuses,
          task.status,
        ];
      }
    } else {
      taskColors[taskStatusToColor] = {
        count: 1,
        statuses: [task.status],
        textColor: mapVariantTaskStatusToDarkColor[task.status],
      };
    }
  });
  return taskColors;
};
