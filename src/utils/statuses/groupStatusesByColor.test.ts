import { mapTaskStatusToColor, taskStatusToCopy } from "constants/task";
import { TaskStatus } from "types/task";
import { groupStatusesByColor } from "./groupStatusesByColor";

test("Separates statuses into groups based on the color of the status", () => {
  const tasks = [
    { status: "success", count: 6 },
    { status: "failed", count: 2 },
    { status: "dispatched", count: 4 },
    { status: "started", count: 5 },
  ];
  expect(groupStatusesByColor(tasks)).toStrictEqual({
    stats: [
      {
        count: 6,
        statuses: [taskStatusToCopy[TaskStatus.Succeeded]],
        color: mapTaskStatusToColor[TaskStatus.Succeeded],
        umbrellaStatus: TaskStatus.Succeeded,
      },
      {
        count: 2,
        statuses: [taskStatusToCopy[TaskStatus.Failed]],
        color: mapTaskStatusToColor[TaskStatus.Failed],
        umbrellaStatus: TaskStatus.Failed,
      },
      {
        count: 4,
        statuses: [taskStatusToCopy[TaskStatus.Dispatched]],
        color: mapTaskStatusToColor[TaskStatus.Dispatched],
        umbrellaStatus: TaskStatus.Dispatched,
      },
      {
        count: 5,
        statuses: [taskStatusToCopy[TaskStatus.Started]],
        color: mapTaskStatusToColor[TaskStatus.Started],
        umbrellaStatus: TaskStatus.Started,
      },
    ],
    max: 6,
    total: 17,
  });
});
test("Groups statuses with different statuses but the same color", () => {
  const tasks = [
    { status: "test-timed-out", count: 6 },
    { status: "failed", count: 2 },
    { status: "dispatched", count: 4 },
    { status: "will-run", count: 2 },
    { status: "system-timed-out", count: 5 },
    { status: "system-unresponsive", count: 2 },
  ];
  expect(groupStatusesByColor(tasks)).toStrictEqual({
    stats: [
      {
        count: 8,
        statuses: [
          taskStatusToCopy[TaskStatus.TestTimedOut],
          taskStatusToCopy[TaskStatus.Failed],
        ],
        color: mapTaskStatusToColor[TaskStatus.Failed],
        umbrellaStatus: TaskStatus.Failed,
      },
      {
        count: 7,
        statuses: [
          taskStatusToCopy[TaskStatus.SystemTimedOut],
          taskStatusToCopy[TaskStatus.SystemUnresponsive],
        ],
        color: mapTaskStatusToColor[TaskStatus.SystemTimedOut],
        umbrellaStatus: TaskStatus.SystemFailed,
      },
      {
        count: 6,
        statuses: [
          taskStatusToCopy[TaskStatus.Dispatched],
          taskStatusToCopy[TaskStatus.WillRun],
        ],
        color: mapTaskStatusToColor[TaskStatus.Dispatched],
        umbrellaStatus: TaskStatus.Dispatched,
      },
    ],
    max: 8,
    total: 21,
  });
});
test("Returns the overall maximum and total", () => {
  const tasks = [
    { status: "task-timed-out", count: 6 },
    { status: "inactive", count: 2 },
    { status: "success", count: 4 },
    { status: "started", count: 3 },
    { status: "system-failed", count: 5 },
    { status: "unscheduled", count: 2 },
    { status: "setup-failed", count: 3 },
    { status: "system-unresponsive", count: 2 },
  ];
  expect(groupStatusesByColor(tasks)).toStrictEqual({
    stats: [
      {
        count: 4,
        statuses: [taskStatusToCopy[TaskStatus.Succeeded]],
        color: mapTaskStatusToColor[TaskStatus.Succeeded],
        umbrellaStatus: TaskStatus.Succeeded,
      },
      {
        count: 6,
        statuses: [taskStatusToCopy[TaskStatus.TaskTimedOut]],
        color: mapTaskStatusToColor[TaskStatus.Failed],
        umbrellaStatus: TaskStatus.Failed,
      },
      {
        count: 7,
        statuses: [
          taskStatusToCopy[TaskStatus.SystemFailed],
          taskStatusToCopy[TaskStatus.SystemUnresponsive],
        ],
        color: mapTaskStatusToColor[TaskStatus.SystemTimedOut],
        umbrellaStatus: TaskStatus.SystemFailed,
      },
      {
        count: 2,
        statuses: [taskStatusToCopy[TaskStatus.Inactive]],
        color: mapTaskStatusToColor[TaskStatus.Inactive],
        umbrellaStatus: TaskStatus.Dispatched,
      },
      {
        count: 3,
        statuses: [taskStatusToCopy[TaskStatus.SetupFailed]],
        color: mapTaskStatusToColor[TaskStatus.SetupFailed],
        umbrellaStatus: TaskStatus.SetupFailed,
      },
      {
        count: 3,
        statuses: [taskStatusToCopy[TaskStatus.Started]],
        color: mapTaskStatusToColor[TaskStatus.Started],
        umbrellaStatus: TaskStatus.Started,
      },
      {
        count: 2,
        statuses: [taskStatusToCopy[TaskStatus.Unscheduled]],
        color: mapTaskStatusToColor[TaskStatus.Unscheduled],
        umbrellaStatus: TaskStatus.Unscheduled,
      },
    ],
    max: 7,
    total: 27,
  });
});
