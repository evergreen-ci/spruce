import { taskStatusToCopy } from "constants/task";
import { TaskStatus } from "types/task";
import { groupStatusesByUmbrellaStatus } from "./groupStatusesByUmbrellaStatus";

describe("groupStatusesByUmbrellaStatus", () => {
  it("separates statuses into groups based on umbrella status", () => {
    const tasks = [
      { status: TaskStatus.Succeeded, count: 6 },
      { status: TaskStatus.Failed, count: 2 },
      { status: TaskStatus.Dispatched, count: 4 },
      { status: TaskStatus.Started, count: 5 },
    ];

    expect(groupStatusesByUmbrellaStatus(tasks)).toStrictEqual({
      stats: [
        {
          count: 6,
          statuses: [taskStatusToCopy[TaskStatus.Succeeded]],
          color: "#13AA52",
          umbrellaStatus: TaskStatus.Succeeded,
          statusCounts: { [TaskStatus.Succeeded]: 6 },
        },
        {
          count: 2,
          statuses: [taskStatusToCopy[TaskStatus.Failed]],
          color: "#CF4A22",
          umbrellaStatus: TaskStatus.FailedUmbrella,
          statusCounts: { failed: 2 },
        },
        {
          count: 9,
          statuses: [
            taskStatusToCopy[TaskStatus.Dispatched],
            taskStatusToCopy[TaskStatus.Started],
          ],
          color: "#FFDD49",
          umbrellaStatus: TaskStatus.RunningUmbrella,
          statusCounts: { [TaskStatus.Dispatched]: 4, [TaskStatus.Started]: 5 },
        },
      ],
      max: 9,
      total: 17,
    });
  });

  it("groups different statuses to the same color", () => {
    const tasks = [
      { status: TaskStatus.TestTimedOut, count: 6 },
      { status: TaskStatus.Failed, count: 2 },
      { status: TaskStatus.Dispatched, count: 4 },
      { status: TaskStatus.WillRun, count: 2 },
      { status: TaskStatus.SystemTimedOut, count: 5 },
      { status: TaskStatus.SystemUnresponsive, count: 2 },
    ];

    expect(groupStatusesByUmbrellaStatus(tasks)).toStrictEqual({
      stats: [
        {
          count: 8,
          statuses: [
            taskStatusToCopy[TaskStatus.TestTimedOut],
            taskStatusToCopy[TaskStatus.Failed],
          ],
          color: "#CF4A22",
          umbrellaStatus: TaskStatus.FailedUmbrella,
          statusCounts: {
            [TaskStatus.TestTimedOut]: 6,
            [TaskStatus.Failed]: 2,
          },
        },
        {
          count: 7,
          statuses: [
            taskStatusToCopy[TaskStatus.SystemTimedOut],
            taskStatusToCopy[TaskStatus.SystemUnresponsive],
          ],
          color: "#4f4fbf",
          umbrellaStatus: TaskStatus.SystemFailureUmbrella,
          statusCounts: {
            [TaskStatus.SystemTimedOut]: 5,
            [TaskStatus.SystemUnresponsive]: 2,
          },
        },
        {
          count: 4,
          statuses: [taskStatusToCopy[TaskStatus.Dispatched]],
          color: "#FFDD49",
          umbrellaStatus: TaskStatus.RunningUmbrella,
          statusCounts: { [TaskStatus.Dispatched]: 4 },
        },
        {
          count: 2,
          statuses: [taskStatusToCopy[TaskStatus.WillRun]],
          color: "#5D6C74",
          umbrellaStatus: TaskStatus.ScheduledUmbrella,
          statusCounts: { [TaskStatus.WillRun]: 2 },
        },
      ],
      max: 8,
      total: 21,
    });
  });

  it("returns the overall maximum and total", () => {
    const tasks = [
      { status: TaskStatus.TaskTimedOut, count: 6 },
      { status: TaskStatus.Succeeded, count: 4 },
      { status: TaskStatus.Started, count: 3 },
      { status: TaskStatus.SystemFailed, count: 5 },
      { status: TaskStatus.Unscheduled, count: 2 },
      { status: TaskStatus.SetupFailed, count: 3 },
      { status: TaskStatus.SystemUnresponsive, count: 2 },
    ];
    expect(groupStatusesByUmbrellaStatus(tasks)).toStrictEqual({
      stats: [
        {
          count: 4,
          statuses: [taskStatusToCopy[TaskStatus.Succeeded]],
          color: "#13AA52",
          umbrellaStatus: TaskStatus.Succeeded,
          statusCounts: { [TaskStatus.Succeeded]: 4 },
        },
        {
          count: 6,
          statuses: [taskStatusToCopy[TaskStatus.TaskTimedOut]],
          color: "#CF4A22",
          umbrellaStatus: TaskStatus.FailedUmbrella,
          statusCounts: { [TaskStatus.TaskTimedOut]: 6 },
        },
        {
          count: 7,
          statuses: [
            taskStatusToCopy[TaskStatus.SystemFailed],
            taskStatusToCopy[TaskStatus.SystemUnresponsive],
          ],
          color: "#4f4fbf",
          umbrellaStatus: TaskStatus.SystemFailureUmbrella,
          statusCounts: {
            [TaskStatus.SystemFailed]: 5,
            [TaskStatus.SystemUnresponsive]: 2,
          },
        },
        {
          count: 3,
          statuses: [taskStatusToCopy[TaskStatus.SetupFailed]],
          color: "#f1f0fc",
          umbrellaStatus: TaskStatus.SetupFailed,
          statusCounts: { [TaskStatus.SetupFailed]: 3 },
        },
        {
          count: 3,
          statuses: [taskStatusToCopy[TaskStatus.Started]],
          color: "#FFDD49",
          umbrellaStatus: TaskStatus.RunningUmbrella,
          statusCounts: { [TaskStatus.Started]: 3 },
        },
        {
          count: 2,
          statuses: [taskStatusToCopy[TaskStatus.Unscheduled]],
          color: "#89979B",
          umbrellaStatus: TaskStatus.UndispatchedUmbrella,
          statusCounts: { [TaskStatus.Unscheduled]: 2 },
        },
      ],
      max: 7,
      total: 25,
    });
  });
});
