import { mapTaskStatusToColor } from "constants/task";
import { TaskStatus } from "types/task";
import {
  getAllTaskStatsGroupedByColor,
  getStatusesWithZeroCount,
} from "./utils";

describe("getAllTaskStatsGroupedByColor", () => {
  test(
    "Grab the taskStatusCounts field from all versions," +
      "returns mapping between version id to its {grouped task stats, max, total}",
    () => {
      expect(getAllTaskStatsGroupedByColor(versions)).toStrictEqual({
        "12": {
          stats: [
            {
              count: 8,
              statuses: ["Test Timed Out", "Failed"],
              color: "#F9D3C5",
              umbrellaStatus: "failed-umbrella",
            },
            {
              count: 7,
              statuses: ["System Time Out", "System Unresponsive"],
              color: "#36367f",
              umbrellaStatus: "system-failure-umbrella",
            },
            {
              count: 4,
              statuses: ["Dispatched"],
              color: "#FEF2C8",
              umbrellaStatus: "running-umbrella",
            },
            {
              count: 2,
              statuses: ["Will Run"],
              color: "#3D4F58",
              umbrellaStatus: "scheduled-umbrella",
            },
          ],
          max: 8,
          total: 21,
        },
        "13": {
          stats: [
            {
              count: 6,
              statuses: ["Success"],
              color: "#C3E7CA",
              umbrellaStatus: "success",
            },
            {
              count: 2,
              statuses: ["Failed"],
              color: "#F9D3C5",
              umbrellaStatus: "failed-umbrella",
            },
            {
              count: 9,
              statuses: ["Dispatched", "Running"],
              color: "#FEF2C8",
              umbrellaStatus: "running-umbrella",
            },
          ],
          max: 9,
          total: 17,
        },
        "14": {
          stats: [
            {
              count: 4,
              statuses: ["Success"],
              color: "#C3E7CA",
              umbrellaStatus: "success",
            },
            {
              count: 6,
              statuses: ["Task Timed Out"],
              color: "#F9D3C5",
              umbrellaStatus: "failed-umbrella",
            },
            {
              count: 7,
              statuses: ["System Failed", "System Unresponsive"],
              color: "#36367f",
              umbrellaStatus: "system-failure-umbrella",
            },
            {
              count: 3,
              statuses: ["Setup Failure"],
              color: "#d5d4f9",
              umbrellaStatus: "setup-failed",
            },
            {
              count: 3,
              statuses: ["Running"],
              color: "#FEF2C8",
              umbrellaStatus: "running-umbrella",
            },
            {
              count: 2,
              statuses: ["Unscheduled"],
              color: "#E7EEEC",
              umbrellaStatus: "undispatched-umbrella",
            },
          ],
          max: 7,
          total: 25,
        },
        "123": {
          stats: [
            {
              count: 4,
              statuses: ["Success"],
              color: "#C3E7CA",
              umbrellaStatus: "success",
            },
            {
              count: 6,
              statuses: ["Task Timed Out"],
              color: "#F9D3C5",
              umbrellaStatus: "failed-umbrella",
            },
            {
              count: 7,
              statuses: ["System Failed", "System Unresponsive"],
              color: "#36367f",
              umbrellaStatus: "system-failure-umbrella",
            },
            {
              count: 3,
              statuses: ["Setup Failure"],
              color: "#d5d4f9",
              umbrellaStatus: "setup-failed",
            },
            {
              count: 3,
              statuses: ["Running"],
              color: "#FEF2C8",
              umbrellaStatus: "running-umbrella",
            },
            {
              count: 2,
              statuses: ["Unscheduled"],
              color: "#E7EEEC",
              umbrellaStatus: "undispatched-umbrella",
            },
          ],
          max: 7,
          total: 25,
        },
      });
    }
  );
});

describe("getStatusesWithZeroCount", () => {
  test("Return an array of umbrella statuses that have 0 count", () => {
    expect(getStatusesWithZeroCount(groupedTaskStats)).toStrictEqual([
      "failed-umbrella",
      "running-umbrella",
      "scheduled-umbrella",
      "system-failure-umbrella",
      "undispatched-umbrella",
    ]);
  });
  test("Should return an empty array when all umbrella statuses are present", () => {
    expect(getStatusesWithZeroCount(groupedTaskStatsAll)).toStrictEqual([]);
  });
  test("Return an array of all umbrella statuses when no umbrella status exists", () => {
    expect(getStatusesWithZeroCount([])).toStrictEqual([
      "failed-umbrella",
      "success",
      "running-umbrella",
      "scheduled-umbrella",
      "system-failure-umbrella",
      "undispatched-umbrella",
      "setup-failed",
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
        { status: "task-timed-out", count: 6 },
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
