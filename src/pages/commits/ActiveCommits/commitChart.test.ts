import { mapTaskStatusToColor } from "constants/task";
import { TaskStatus } from "types/task";
import { groupStatusesByColor } from "./utils";

describe("groupTasksByColor", () => {
  test("Seperates statuses into groups based on the color of the status", () => {
    const tasks = [
      { status: "Succeeded", count: 6 },
      { status: "Failed", count: 2 },
      { status: "Dispatched", count: 4 },
      { status: "Started", count: 5 },
    ];
    expect(groupStatusesByColor(tasks)).toStrictEqual({
      stats: {
        [mapTaskStatusToColor[TaskStatus.Succeeded]]: {
          count: 6,
          statuses: [TaskStatus.Succeeded],
        },
        [mapTaskStatusToColor[TaskStatus.Failed]]: {
          count: 2,
          statuses: [TaskStatus.Failed],
        },
        [mapTaskStatusToColor[TaskStatus.SystemFailed]]: {
          count: 0,
          statuses: [],
        },
        [mapTaskStatusToColor[TaskStatus.Dispatched]]: {
          count: 4,
          statuses: [TaskStatus.Dispatched],
        },
        [mapTaskStatusToColor[TaskStatus.SetupFailed]]: {
          count: 0,
          statuses: [],
        },
        [mapTaskStatusToColor[TaskStatus.Started]]: {
          count: 5,
          statuses: [TaskStatus.Started],
        },
        [mapTaskStatusToColor[TaskStatus.Unscheduled]]: {
          count: 0,
          statuses: [],
        },
      },
      max: 6,
      total: 17,
    });
  });
  test("Groups statuses with different statuses but the same color", () => {
    const tasks = [
      { status: "TestTimedOut", count: 6 },
      { status: "Failed", count: 2 },
      { status: "Dispatched", count: 4 },
      { status: "WillRun", count: 2 },
      { status: "SystemTimedOut", count: 5 },
      { status: "SystemUnresponsive", count: 2 },
    ];
    expect(groupStatusesByColor(tasks)).toStrictEqual({
      stats: {
        [mapTaskStatusToColor[TaskStatus.Succeeded]]: {
          count: 0,
          statuses: [],
        },
        [mapTaskStatusToColor[TaskStatus.Failed]]: {
          count: 8,
          statuses: [TaskStatus.TestTimedOut, TaskStatus.Failed],
        },
        [mapTaskStatusToColor[TaskStatus.Dispatched]]: {
          count: 6,
          statuses: [TaskStatus.Dispatched, TaskStatus.WillRun],
        },
        [mapTaskStatusToColor[TaskStatus.SystemTimedOut]]: {
          count: 7,
          statuses: [TaskStatus.SystemTimedOut, TaskStatus.SystemUnresponsive],
        },
        [mapTaskStatusToColor[TaskStatus.SetupFailed]]: {
          count: 0,
          statuses: [],
        },
        [mapTaskStatusToColor[TaskStatus.Started]]: {
          count: 0,
          statuses: [],
        },
        [mapTaskStatusToColor[TaskStatus.Unscheduled]]: {
          count: 0,
          statuses: [],
        },
      },
      max: 8,
      total: 21,
    });
  });
  test("Returns the overall maximum and toatl", () => {
    const tasks = [
      { status: "TaskTimedOut", count: 6 },
      { status: "Inactive", count: 2 },
      { status: "Succeeded", count: 4 },
      { status: "Started", count: 3 },
      { status: "SystemFailed", count: 5 },
      { status: "Unscheduled", count: 2 },
      { status: "SetupFailed", count: 3 },
      { status: "SystemUnresponsive", count: 2 },
    ];
    expect(groupStatusesByColor(tasks)).toStrictEqual({
      stats: {
        [mapTaskStatusToColor[TaskStatus.Succeeded]]: {
          count: 4,
          statuses: [TaskStatus.Succeeded],
        },
        [mapTaskStatusToColor[TaskStatus.Failed]]: {
          count: 6,
          statuses: [TaskStatus.TaskTimedOut],
        },
        [mapTaskStatusToColor[TaskStatus.SystemTimedOut]]: {
          count: 7,
          statuses: [TaskStatus.SystemFailed, TaskStatus.SystemUnresponsive],
        },
        [mapTaskStatusToColor[TaskStatus.Inactive]]: {
          count: 2,
          statuses: [TaskStatus.Inactive],
        },
        [mapTaskStatusToColor[TaskStatus.SetupFailed]]: {
          count: 3,
          statuses: [TaskStatus.SetupFailed],
        },
        [mapTaskStatusToColor[TaskStatus.Started]]: {
          count: 3,
          statuses: [TaskStatus.Started],
        },
        [mapTaskStatusToColor[TaskStatus.Unscheduled]]: {
          count: 2,
          statuses: [TaskStatus.Unscheduled],
        },
      },
      max: 7,
      total: 27,
    });
  });
});
