import { mapTaskStatusToColor } from "constants/task";
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
        statuses: [TaskStatus.Succeeded],
        color: mapTaskStatusToColor[TaskStatus.Succeeded],
      },
      {
        count: 2,
        statuses: [TaskStatus.Failed],
        color: mapTaskStatusToColor[TaskStatus.Failed],
      },
      {
        count: 4,
        statuses: [TaskStatus.Dispatched],
        color: mapTaskStatusToColor[TaskStatus.Dispatched],
      },
      {
        count: 5,
        statuses: [TaskStatus.Started],
        color: mapTaskStatusToColor[TaskStatus.Started],
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
        statuses: [TaskStatus.TestTimedOut, TaskStatus.Failed],
        color: mapTaskStatusToColor[TaskStatus.Failed],
      },
      {
        count: 7,
        statuses: [TaskStatus.SystemTimedOut, TaskStatus.SystemUnresponsive],
        color: mapTaskStatusToColor[TaskStatus.SystemTimedOut],
      },
      {
        count: 6,
        statuses: [TaskStatus.Dispatched, TaskStatus.WillRun],
        color: mapTaskStatusToColor[TaskStatus.Dispatched],
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
        statuses: [TaskStatus.Succeeded],
        color: mapTaskStatusToColor[TaskStatus.Succeeded],
      },
      {
        count: 6,
        statuses: [TaskStatus.TaskTimedOut],
        color: mapTaskStatusToColor[TaskStatus.Failed],
      },
      {
        count: 7,
        statuses: [TaskStatus.SystemFailed, TaskStatus.SystemUnresponsive],
        color: mapTaskStatusToColor[TaskStatus.SystemTimedOut],
      },
      {
        count: 2,
        statuses: [TaskStatus.Inactive],
        color: mapTaskStatusToColor[TaskStatus.Inactive],
      },
      {
        count: 3,
        statuses: [TaskStatus.SetupFailed],
        color: mapTaskStatusToColor[TaskStatus.SetupFailed],
      },
      {
        count: 3,
        statuses: [TaskStatus.Started],
        color: mapTaskStatusToColor[TaskStatus.Started],
      },
      {
        count: 2,
        statuses: [TaskStatus.Unscheduled],
        color: mapTaskStatusToColor[TaskStatus.Unscheduled],
      },
    ],
    max: 7,
    total: 27,
  });
});
