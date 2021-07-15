import { mapTaskStatusToColor } from "constants/task";
import { TaskStatus } from "types/task";
import { groupStatusesByColor, getAllTaskStatsGroupedByColor } from "./utils";

describe("groupStatusesByColor", () => {
  test("Seperates statuses into groups based on the color of the status", () => {
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
  test("Returns the overall maximum and toatl", () => {
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
});

describe("getAllTaskStatsGroupedByColor", () => {
  test(
    "Grab the taskStatusCounts field from all versions," +
      "returns mapping between version id to its {grouped task stats, max, total}",
    () => {
      expect(getAllTaskStatsGroupedByColor(versions)).toStrictEqual({
        "123": {
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
              statuses: [
                TaskStatus.SystemFailed,
                TaskStatus.SystemUnresponsive,
              ],
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
        },
        "12": {
          stats: [
            {
              count: 8,
              statuses: [TaskStatus.TestTimedOut, TaskStatus.Failed],
              color: mapTaskStatusToColor[TaskStatus.Failed],
            },
            {
              count: 7,
              statuses: [
                TaskStatus.SystemTimedOut,
                TaskStatus.SystemUnresponsive,
              ],
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
        },
        "13": {
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
        },
        "14": {
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
              statuses: [
                TaskStatus.SystemFailed,
                TaskStatus.SystemUnresponsive,
              ],
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
        },
      });
    }
  );
});

const versions = [
  {
    version: {
      id: "123",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      author: "Mohamed Khelif",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: "task-timed-out", count: 6 },
        { status: "inactive", count: 2 },
        { status: "success", count: 4 },
        { status: "started", count: 3 },
        { status: "system-failed", count: 5 },
        { status: "unscheduled", count: 2 },
        { status: "setup-failed", count: 3 },
        { status: "system-unresponsive", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "12",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      author: "Arjun Patel",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: "test-timed-out", count: 6 },
        { status: "failed", count: 2 },
        { status: "dispatched", count: 4 },
        { status: "will-run", count: 2 },
        { status: "system-timed-out", count: 5 },
        { status: "system-unresponsive", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "13",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      author: "Mohamed Khelif",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: "success", count: 6 },
        { status: "failed", count: 2 },
        { status: "dispatched", count: 4 },
        { status: "started", count: 5 },
      ],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "14",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      order: 39366,
      author: "Arjun Patel",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: "task-timed-out", count: 6 },
        { status: "inactive", count: 2 },
        { status: "success", count: 4 },
        { status: "started", count: 3 },
        { status: "system-failed", count: 5 },
        { status: "unscheduled", count: 2 },
        { status: "setup-failed", count: 3 },
        { status: "system-unresponsive", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
];
