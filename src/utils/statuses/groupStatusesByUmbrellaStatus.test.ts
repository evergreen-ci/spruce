import { palette } from "@leafygreen-ui/palette";
import { taskStatusToCopy } from "constants/task";
import { TaskStatus } from "types/task";
import { groupStatusesByUmbrellaStatus } from "./groupStatusesByUmbrellaStatus";

const { gray, green, purple, red, yellow } = palette;

describe("groupStatusesByUmbrellaStatus", () => {
  it("separates statuses into groups based on umbrella status", () => {
    const tasks = [
      { count: 6, status: TaskStatus.Succeeded },
      { count: 2, status: TaskStatus.Failed },
      { count: 4, status: TaskStatus.Dispatched },
      { count: 5, status: TaskStatus.Started },
    ];

    expect(groupStatusesByUmbrellaStatus(tasks)).toStrictEqual({
      max: 9,
      stats: [
        {
          color: green.dark1,
          count: 6,
          statusCounts: { [TaskStatus.Succeeded]: 6 },
          statuses: [taskStatusToCopy[TaskStatus.Succeeded]],
          umbrellaStatus: TaskStatus.Succeeded,
        },
        {
          color: red.base,
          count: 2,
          statusCounts: { failed: 2 },
          statuses: [taskStatusToCopy[TaskStatus.Failed]],
          umbrellaStatus: TaskStatus.FailedUmbrella,
        },
        {
          color: yellow.base,
          count: 9,
          statusCounts: { [TaskStatus.Dispatched]: 4, [TaskStatus.Started]: 5 },
          statuses: [
            taskStatusToCopy[TaskStatus.Dispatched],
            taskStatusToCopy[TaskStatus.Started],
          ],
          umbrellaStatus: TaskStatus.RunningUmbrella,
        },
      ],
      total: 17,
    });
  });

  it("groups different statuses to the same color", () => {
    const tasks = [
      { count: 6, status: TaskStatus.TestTimedOut },
      { count: 2, status: TaskStatus.Failed },
      { count: 4, status: TaskStatus.Dispatched },
      { count: 2, status: TaskStatus.WillRun },
      { count: 5, status: TaskStatus.SystemTimedOut },
      { count: 2, status: TaskStatus.SystemUnresponsive },
    ];

    expect(groupStatusesByUmbrellaStatus(tasks)).toStrictEqual({
      max: 8,
      stats: [
        {
          color: red.base,
          count: 8,
          statusCounts: {
            [TaskStatus.TestTimedOut]: 6,
            [TaskStatus.Failed]: 2,
          },
          statuses: [
            taskStatusToCopy[TaskStatus.TestTimedOut],
            taskStatusToCopy[TaskStatus.Failed],
          ],
          umbrellaStatus: TaskStatus.FailedUmbrella,
        },
        {
          color: purple.dark2,
          count: 7,
          statusCounts: {
            [TaskStatus.SystemTimedOut]: 5,
            [TaskStatus.SystemUnresponsive]: 2,
          },
          statuses: [
            taskStatusToCopy[TaskStatus.SystemTimedOut],
            taskStatusToCopy[TaskStatus.SystemUnresponsive],
          ],
          umbrellaStatus: TaskStatus.SystemFailureUmbrella,
        },
        {
          color: yellow.base,
          count: 4,
          statusCounts: { [TaskStatus.Dispatched]: 4 },
          statuses: [taskStatusToCopy[TaskStatus.Dispatched]],
          umbrellaStatus: TaskStatus.RunningUmbrella,
        },
        {
          color: gray.base,
          count: 2,
          statusCounts: { [TaskStatus.WillRun]: 2 },
          statuses: [taskStatusToCopy[TaskStatus.WillRun]],
          umbrellaStatus: TaskStatus.ScheduledUmbrella,
        },
      ],
      total: 21,
    });
  });

  it("returns the overall maximum and total", () => {
    const tasks = [
      { count: 6, status: TaskStatus.TaskTimedOut },
      { count: 4, status: TaskStatus.Succeeded },
      { count: 3, status: TaskStatus.Started },
      { count: 5, status: TaskStatus.SystemFailed },
      { count: 2, status: TaskStatus.Unscheduled },
      { count: 3, status: TaskStatus.SetupFailed },
      { count: 2, status: TaskStatus.SystemUnresponsive },
    ];
    expect(groupStatusesByUmbrellaStatus(tasks)).toStrictEqual({
      max: 7,
      stats: [
        {
          color: green.dark1,
          count: 4,
          statusCounts: { [TaskStatus.Succeeded]: 4 },
          statuses: [taskStatusToCopy[TaskStatus.Succeeded]],
          umbrellaStatus: TaskStatus.Succeeded,
        },
        {
          color: red.base,
          count: 6,
          statusCounts: { [TaskStatus.TaskTimedOut]: 6 },
          statuses: [taskStatusToCopy[TaskStatus.TaskTimedOut]],
          umbrellaStatus: TaskStatus.FailedUmbrella,
        },
        {
          color: purple.dark2,
          count: 7,
          statusCounts: {
            [TaskStatus.SystemFailed]: 5,
            [TaskStatus.SystemUnresponsive]: 2,
          },
          statuses: [
            taskStatusToCopy[TaskStatus.SystemFailed],
            taskStatusToCopy[TaskStatus.SystemUnresponsive],
          ],
          umbrellaStatus: TaskStatus.SystemFailureUmbrella,
        },
        {
          color: purple.light2,
          count: 3,
          statusCounts: { [TaskStatus.SetupFailed]: 3 },
          statuses: [taskStatusToCopy[TaskStatus.SetupFailed]],
          umbrellaStatus: TaskStatus.SetupFailed,
        },
        {
          color: yellow.base,
          count: 3,
          statusCounts: { [TaskStatus.Started]: 3 },
          statuses: [taskStatusToCopy[TaskStatus.Started]],
          umbrellaStatus: TaskStatus.RunningUmbrella,
        },
        {
          color: gray.dark1,
          count: 2,
          statusCounts: { [TaskStatus.Unscheduled]: 2 },
          statuses: [taskStatusToCopy[TaskStatus.Unscheduled]],
          umbrellaStatus: TaskStatus.UndispatchedUmbrella,
        },
      ],
      total: 25,
    });
  });
});
