import { mapTaskStatusToColor, mapTaskStatusToTextColor } from "constants/task";
import { TaskStatus } from "types/task";
import { groupTasksByColor } from "./utils";

describe("groupTasksByColor", () => {
  test("Seperates tasks into groups based on the color of the status", () => {
    const tasks = [
      {
        id: "123",
        execution: 0,
        displayName: "some-task",
        status: TaskStatus.Failed,
      },
      {
        id: "234",
        execution: 0,
        displayName: "some-other-task",
        status: TaskStatus.Succeeded,
      },
      {
        id: "2020",
        execution: 0,
        displayName: "some-other-task",
        status: TaskStatus.Started,
      },
    ];
    expect(groupTasksByColor(tasks)).toStrictEqual({
      [mapTaskStatusToColor[TaskStatus.Succeeded]]: {
        count: 1,
        statuses: [TaskStatus.Succeeded],
        textColor: mapTaskStatusToTextColor[TaskStatus.Succeeded],
      },
      [mapTaskStatusToColor[TaskStatus.Failed]]: {
        count: 1,
        statuses: [TaskStatus.Failed],
        textColor: mapTaskStatusToTextColor[TaskStatus.Failed],
      },
      [mapTaskStatusToColor[TaskStatus.Started]]: {
        count: 1,
        statuses: [TaskStatus.Started],
        textColor: mapTaskStatusToTextColor[TaskStatus.Started],
      },
    });
  });
  test("Groups tasks with different statuses but the same color", () => {
    const tasks = [
      {
        id: "123",
        execution: 0,
        displayName: "some-task",
        status: TaskStatus.Failed,
      },
      {
        id: "1996",
        execution: 0,
        displayName: "some-failed-task",
        status: TaskStatus.TaskTimedOut,
      },
      {
        id: "234",
        execution: 0,
        displayName: "some-other-task",
        status: TaskStatus.Succeeded,
      },
      {
        id: "2020",
        execution: 0,
        displayName: "some-other-task",
        status: TaskStatus.Started,
      },
    ];
    expect(groupTasksByColor(tasks)).toStrictEqual({
      [mapTaskStatusToColor[TaskStatus.Succeeded]]: {
        count: 1,
        statuses: [TaskStatus.Succeeded],
        textColor: mapTaskStatusToTextColor[TaskStatus.Succeeded],
      },
      [mapTaskStatusToColor[TaskStatus.Failed]]: {
        count: 2,
        statuses: [TaskStatus.Failed, TaskStatus.TaskTimedOut],
        textColor: mapTaskStatusToTextColor[TaskStatus.Failed],
      },
      [mapTaskStatusToColor[TaskStatus.Started]]: {
        count: 1,
        statuses: [TaskStatus.Started],
        textColor: mapTaskStatusToTextColor[TaskStatus.Started],
      },
    });
  });
  test("Keeps an accurate count of tasks with the same status and doesnt duplicate statuses", () => {
    const tasks = [
      {
        id: "123",
        execution: 0,
        displayName: "some-task",
        status: TaskStatus.Failed,
      },
      {
        id: "1996",
        execution: 0,
        displayName: "some-failed-task",
        status: TaskStatus.Failed,
      },
      {
        id: "234",
        execution: 0,
        displayName: "some-other-task",
        status: TaskStatus.Succeeded,
      },
      {
        id: "2020",
        execution: 0,
        displayName: "some-other-task",
        status: TaskStatus.Started,
      },
    ];
    expect(groupTasksByColor(tasks)).toStrictEqual({
      [mapTaskStatusToColor[TaskStatus.Succeeded]]: {
        count: 1,
        statuses: [TaskStatus.Succeeded],
        textColor: mapTaskStatusToTextColor[TaskStatus.Succeeded],
      },
      [mapTaskStatusToColor[TaskStatus.Failed]]: {
        count: 2,
        statuses: [TaskStatus.Failed],
        textColor: mapTaskStatusToTextColor[TaskStatus.Failed],
      },
      [mapTaskStatusToColor[TaskStatus.Started]]: {
        count: 1,
        statuses: [TaskStatus.Started],
        textColor: mapTaskStatusToTextColor[TaskStatus.Started],
      },
    });
  });
});
