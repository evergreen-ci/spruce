import { mapTaskStatusToColor, taskStatusToCopy } from "constants/task";
import { TaskStatus } from "types/task";
import {
  getAllTaskStatsGroupedByColor,
  getStatusesWithZeroCount,
} from "./utils";

describe("getAllTaskStatsGroupedByColor", () => {
  it("grab the taskStatusCounts field from all versions, returns mapping between version id to its {grouped task stats, max, total}", () => {
    expect(getAllTaskStatsGroupedByColor(versions)).toStrictEqual({
      "12": {
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
      },
      "13": {
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
            statusCounts: { [TaskStatus.Failed]: 2 },
          },
          {
            count: 9,
            statuses: [
              taskStatusToCopy[TaskStatus.Dispatched],
              taskStatusToCopy[TaskStatus.Started],
            ],
            color: "#FFDD49",
            umbrellaStatus: TaskStatus.RunningUmbrella,
            statusCounts: {
              [TaskStatus.Dispatched]: 4,
              [TaskStatus.Started]: 5,
            },
          },
        ],
        max: 9,
        total: 17,
      },
      "14": {
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
            statusCounts: { started: 3 },
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
      },
      "123": {
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
            statusCounts: { started: 3 },
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
      },
    });
  });
});

describe("getStatusesWithZeroCount", () => {
  it("return an array of umbrella statuses that have 0 count", () => {
    expect(getStatusesWithZeroCount(groupedTaskStats)).toStrictEqual([
      TaskStatus.FailedUmbrella,
      TaskStatus.RunningUmbrella,
      TaskStatus.ScheduledUmbrella,
      TaskStatus.SystemFailureUmbrella,
      TaskStatus.UndispatchedUmbrella,
    ]);
  });
  it("should return an empty array when all umbrella statuses are present", () => {
    expect(getStatusesWithZeroCount(groupedTaskStatsAll)).toStrictEqual([]);
  });
  it("return an array of all umbrella statuses when no umbrella status exists", () => {
    expect(getStatusesWithZeroCount([])).toStrictEqual([
      TaskStatus.FailedUmbrella,
      TaskStatus.Succeeded,
      TaskStatus.RunningUmbrella,
      TaskStatus.ScheduledUmbrella,
      TaskStatus.SystemFailureUmbrella,
      TaskStatus.UndispatchedUmbrella,
      TaskStatus.SetupFailed,
    ]);
  });
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
        { status: TaskStatus.TaskTimedOut, count: 6 },
        { status: TaskStatus.Succeeded, count: 4 },
        { status: TaskStatus.Started, count: 3 },
        { status: TaskStatus.SystemFailed, count: 5 },
        { status: TaskStatus.Unscheduled, count: 2 },
        { status: TaskStatus.SetupFailed, count: 3 },
        { status: TaskStatus.SystemUnresponsive, count: 2 },
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
        { status: TaskStatus.TestTimedOut, count: 6 },
        { status: TaskStatus.Failed, count: 2 },
        { status: TaskStatus.Dispatched, count: 4 },
        { status: TaskStatus.WillRun, count: 2 },
        { status: TaskStatus.SystemTimedOut, count: 5 },
        { status: TaskStatus.SystemUnresponsive, count: 2 },
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
        { status: TaskStatus.Succeeded, count: 6 },
        { status: TaskStatus.Failed, count: 2 },
        { status: TaskStatus.Dispatched, count: 4 },
        { status: TaskStatus.Started, count: 5 },
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
        { status: TaskStatus.TaskTimedOut, count: 6 },
        { status: TaskStatus.Succeeded, count: 4 },
        { status: TaskStatus.Started, count: 3 },
        { status: TaskStatus.SystemFailed, count: 5 },
        { status: TaskStatus.Unscheduled, count: 2 },
        { status: TaskStatus.SetupFailed, count: 3 },
        { status: TaskStatus.SystemUnresponsive, count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
];

const groupedTaskStatsAll = [
  {
    umbrellaStatus: TaskStatus.Succeeded,
    count: 2,
    statuses: [TaskStatus.Succeeded],
    color: mapTaskStatusToColor[TaskStatus.Succeeded],
  },
  {
    umbrellaStatus: TaskStatus.FailedUmbrella,
    count: 1,
    statuses: [TaskStatus.Failed],
    color: mapTaskStatusToColor[TaskStatus.Failed],
  },
  {
    umbrellaStatus: TaskStatus.SystemFailureUmbrella,
    count: 3,
    statuses: [TaskStatus.SystemFailed],
    color: mapTaskStatusToColor[TaskStatus.SystemFailed],
  },
  {
    umbrellaStatus: TaskStatus.SetupFailed,
    count: 5,
    statuses: [TaskStatus.SetupFailed],
    color: mapTaskStatusToColor[TaskStatus.SetupFailed],
  },
  {
    umbrellaStatus: TaskStatus.Undispatched,
    count: 1,
    statuses: [TaskStatus.Unscheduled],
    color: mapTaskStatusToColor[TaskStatus.Unscheduled],
  },
  {
    umbrellaStatus: TaskStatus.RunningUmbrella,
    count: 6,
    statuses: [TaskStatus.Started],
    color: mapTaskStatusToColor[TaskStatus.Started],
  },
  {
    umbrellaStatus: TaskStatus.Dispatched,
    count: 7,
    statuses: [TaskStatus.Dispatched],
    color: mapTaskStatusToColor[TaskStatus.Dispatched],
  },
  {
    umbrellaStatus: TaskStatus.Inactive,
    count: 7,
    statuses: [TaskStatus.Inactive],
    color: mapTaskStatusToColor[TaskStatus.Inactive],
  },
  {
    umbrellaStatus: TaskStatus.ScheduledUmbrella,
    count: 7,
    statuses: [TaskStatus.WillRun],
    color: mapTaskStatusToColor[TaskStatus.WillRun],
  },
  {
    umbrellaStatus: TaskStatus.UndispatchedUmbrella,
    count: 7,
    statuses: [TaskStatus.Unscheduled],
    color: mapTaskStatusToColor[TaskStatus.Unscheduled],
  },
];

const groupedTaskStats = [
  {
    umbrellaStatus: TaskStatus.Succeeded,
    count: 2,
    statuses: [TaskStatus.Succeeded],
    color: mapTaskStatusToColor[TaskStatus.Succeeded],
  },
  {
    umbrellaStatus: TaskStatus.Failed,
    count: 1,
    statuses: [TaskStatus.Failed],
    color: mapTaskStatusToColor[TaskStatus.Failed],
  },
  {
    umbrellaStatus: TaskStatus.Unscheduled,
    count: 1,
    statuses: [TaskStatus.Unscheduled],
    color: mapTaskStatusToColor[TaskStatus.Unscheduled],
  },
  {
    umbrellaStatus: TaskStatus.SetupFailed,
    count: 5,
    statuses: [TaskStatus.SetupFailed],
    color: mapTaskStatusToColor[TaskStatus.SetupFailed],
  },
];
