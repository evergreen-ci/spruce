import {
  mapVariantTaskStatusToColor,
  mapVariantTaskStatusToDarkColor,
} from "components/StatusSquare";
import { PatchBuildVariantTask } from "gql/generated/types";
import { TaskStatus } from "types/task";
import { groupTasksByColor } from "./utils";

describe("groupTasksByColor", () => {
  test("Seperates tasks into groups based on the color of the status", () => {
    const tasks: PatchBuildVariantTask[] = [
      {
        id: "123",
        name: "some-task",
        status: TaskStatus.Failed,
      },
      {
        id: "234",
        name: "some-other-task",
        status: TaskStatus.Succeeded,
      },
      {
        id: "2020",
        name: "some-other-task",
        status: TaskStatus.Started,
      },
    ];
    expect(groupTasksByColor(tasks)).toStrictEqual({
      [mapVariantTaskStatusToColor[TaskStatus.Succeeded]]: {
        count: 1,
        statuses: [TaskStatus.Succeeded],
        textColor: mapVariantTaskStatusToDarkColor[TaskStatus.Succeeded],
      },
      [mapVariantTaskStatusToColor[TaskStatus.Failed]]: {
        count: 1,
        statuses: [TaskStatus.Failed],
        textColor: mapVariantTaskStatusToDarkColor[TaskStatus.Failed],
      },
      [mapVariantTaskStatusToColor[TaskStatus.Started]]: {
        count: 1,
        statuses: [TaskStatus.Started],
        textColor: mapVariantTaskStatusToDarkColor[TaskStatus.Started],
      },
    });
  });
  test("Groups tasks with different statuses but the same color", () => {
    const tasks: PatchBuildVariantTask[] = [
      {
        id: "123",
        name: "some-task",
        status: TaskStatus.Failed,
      },
      {
        id: "1996",
        name: "some-failed-task",
        status: TaskStatus.TaskTimedOut,
      },
      {
        id: "234",
        name: "some-other-task",
        status: TaskStatus.Succeeded,
      },
      {
        id: "2020",
        name: "some-other-task",
        status: TaskStatus.Started,
      },
    ];
    expect(groupTasksByColor(tasks)).toStrictEqual({
      [mapVariantTaskStatusToColor[TaskStatus.Succeeded]]: {
        count: 1,
        statuses: [TaskStatus.Succeeded],
        textColor: mapVariantTaskStatusToDarkColor[TaskStatus.Succeeded],
      },
      [mapVariantTaskStatusToColor[TaskStatus.Failed]]: {
        count: 2,
        statuses: [TaskStatus.Failed, TaskStatus.TaskTimedOut],
        textColor: mapVariantTaskStatusToDarkColor[TaskStatus.Failed],
      },
      [mapVariantTaskStatusToColor[TaskStatus.Started]]: {
        count: 1,
        statuses: [TaskStatus.Started],
        textColor: mapVariantTaskStatusToDarkColor[TaskStatus.Started],
      },
    });
  });
  test("Keeps an accurate count of tasks with the same status and doesnt duplicate statuses", () => {
    const tasks: PatchBuildVariantTask[] = [
      {
        id: "123",
        name: "some-task",
        status: TaskStatus.Failed,
      },
      {
        id: "1996",
        name: "some-failed-task",
        status: TaskStatus.Failed,
      },
      {
        id: "234",
        name: "some-other-task",
        status: TaskStatus.Succeeded,
      },
      {
        id: "2020",
        name: "some-other-task",
        status: TaskStatus.Started,
      },
    ];
    expect(groupTasksByColor(tasks)).toStrictEqual({
      [mapVariantTaskStatusToColor[TaskStatus.Succeeded]]: {
        count: 1,
        statuses: [TaskStatus.Succeeded],
        textColor: mapVariantTaskStatusToDarkColor[TaskStatus.Succeeded],
      },
      [mapVariantTaskStatusToColor[TaskStatus.Failed]]: {
        count: 2,
        statuses: [TaskStatus.Failed],
        textColor: mapVariantTaskStatusToDarkColor[TaskStatus.Failed],
      },
      [mapVariantTaskStatusToColor[TaskStatus.Started]]: {
        count: 1,
        statuses: [TaskStatus.Started],
        textColor: mapVariantTaskStatusToDarkColor[TaskStatus.Started],
      },
    });
  });
});
