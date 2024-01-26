import { palette } from "@leafygreen-ui/palette";
import { TaskStatus } from "types/task";

const { gray, green, purple, red, yellow } = palette;

const buildVariant1 = {
  displayName: "Enterprise macOS C++20 DEBUG",
  variant: "enterprise-macos-cxx20",
  tasks: [
    {
      status: TaskStatus.WillRun,
      id: "auth",
      execution: 0,
      displayName: "auth",
      hasCedarResults: false,
    },
  ],
};

const buildVariant2 = {
  displayName: "~ Enterprise Windows (Benchmarks)",
  variant: "enterprise-windows-benchmarks",
  tasks: [
    {
      status: TaskStatus.Pending,
      id: "benchmarks",
      execution: 0,
      displayName: "benchmarks",
      hasCedarResults: false,
    },
  ],
};

const buildVariant3 = {
  displayName: "Enterprise RHEL 8.0 (inMemory)",
  variant: "enterprise-rhel-80-64-bit-inmem",
  tasks: [
    {
      status: TaskStatus.Failed,
      id: "fuzzer",
      execution: 0,
      displayName: "fuzzer",
      hasCedarResults: true,
    },
  ],
};

const buildVariantStat = {
  displayName: "Enterprise macOS C++20 DEBUG",
  variant: "enterprise-macos-cxx20",
  statusCounts: [
    {
      count: 4,
      status: TaskStatus.Blocked,
    },
    {
      count: 1,
      status: TaskStatus.Succeeded,
    },
    {
      count: 1,
      status: TaskStatus.Failed,
    },
  ],
};

const versions = [
  {
    version: {
      id: "123",
      projectIdentifier: "mongodb-mongo-master",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      order: 39369,
      author: "Mohamed Khelif",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        eta: null,
        counts: [
          { status: TaskStatus.TaskTimedOut, count: 6 },
          { status: TaskStatus.Succeeded, count: 4 },
          { status: TaskStatus.Started, count: 3 },
          { status: TaskStatus.SystemFailed, count: 5 },
          { status: TaskStatus.Unscheduled, count: 2 },
          { status: TaskStatus.SetupFailed, count: 3 },
          { status: TaskStatus.SystemUnresponsive, count: 2 },
        ],
      },
      buildVariants: [buildVariant1],
      buildVariantStats: [buildVariantStat],
      gitTags: null,
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "12",
      projectIdentifier: "mongodb-mongo-master",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      order: 39368,
      author: "Arjun Patel",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        eta: null,
        counts: [
          { status: TaskStatus.TestTimedOut, count: 6 },
          { status: TaskStatus.Failed, count: 2 },
          { status: TaskStatus.Dispatched, count: 4 },
          { status: TaskStatus.WillRun, count: 2 },
          { status: TaskStatus.SystemTimedOut, count: 5 },
          { status: TaskStatus.SystemUnresponsive, count: 2 },
        ],
      },
      buildVariants: [buildVariant1, buildVariant2],
      buildVariantStats: [],
      gitTags: null,
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "13",
      projectIdentifier: "mongodb-mongo-master",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      order: 39367,
      author: "Mohamed Khelif",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        eta: null,
        counts: [
          { status: TaskStatus.Succeeded, count: 6 },
          { status: TaskStatus.Failed, count: 2 },
          { status: TaskStatus.Dispatched, count: 4 },
          { status: TaskStatus.Started, count: 5 },
        ],
      },
      buildVariants: [buildVariant1, buildVariant2, buildVariant3],
      buildVariantStats: [],
      gitTags: null,
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "14",
      projectIdentifier: "mongodb-mongo-master",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      order: 39366,
      author: "Arjun Patel",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        eta: null,
        counts: [
          { status: TaskStatus.TaskTimedOut, count: 6 },
          { status: TaskStatus.Succeeded, count: 4 },
          { status: TaskStatus.Started, count: 3 },
          { status: TaskStatus.SystemFailed, count: 5 },
          { status: TaskStatus.Unscheduled, count: 2 },
          { status: TaskStatus.SetupFailed, count: 3 },
          { status: TaskStatus.SystemUnresponsive, count: 2 },
        ],
      },
      buildVariants: [buildVariant1],
      buildVariantStats: [],
      gitTags: null,
    },
    rolledUpVersions: null,
  },
];

const groupedTaskStatsAll = [
  {
    umbrellaStatus: TaskStatus.Succeeded,
    count: 2,
    statuses: [TaskStatus.Succeeded],
    color: green.dark1,
  },
  {
    umbrellaStatus: TaskStatus.FailedUmbrella,
    count: 1,
    statuses: [TaskStatus.Failed],
    color: red.base,
  },
  {
    umbrellaStatus: TaskStatus.SystemFailureUmbrella,
    count: 3,
    statuses: [TaskStatus.SystemFailed],
    color: purple.dark2,
  },
  {
    umbrellaStatus: TaskStatus.SetupFailed,
    count: 5,
    statuses: [TaskStatus.SetupFailed],
    color: purple.light2,
  },
  {
    umbrellaStatus: TaskStatus.Undispatched,
    count: 1,
    statuses: [TaskStatus.Unscheduled],
    color: gray.dark1,
  },
  {
    umbrellaStatus: TaskStatus.RunningUmbrella,
    count: 6,
    statuses: [TaskStatus.Started],
    color: yellow.base,
  },
  {
    umbrellaStatus: TaskStatus.Dispatched,
    count: 7,
    statuses: [TaskStatus.Dispatched],
    color: gray.dark1,
  },
  {
    umbrellaStatus: TaskStatus.Inactive,
    count: 7,
    statuses: [TaskStatus.Inactive],
    color: gray.dark1,
  },
  {
    umbrellaStatus: TaskStatus.ScheduledUmbrella,
    count: 7,
    statuses: [TaskStatus.WillRun],
    color: gray.dark1,
  },
  {
    umbrellaStatus: TaskStatus.UndispatchedUmbrella,
    count: 7,
    statuses: [TaskStatus.Unscheduled],
    color: gray.dark1,
  },
];

const groupedTaskStats = [
  {
    umbrellaStatus: TaskStatus.Succeeded,
    count: 2,
    statuses: [TaskStatus.Succeeded],
    color: green.dark1,
  },
  {
    umbrellaStatus: TaskStatus.Failed,
    count: 1,
    statuses: [TaskStatus.Failed],
    color: red.base,
  },
  {
    umbrellaStatus: TaskStatus.Unscheduled,
    count: 1,
    statuses: [TaskStatus.Unscheduled],
    color: gray.dark1,
  },
  {
    umbrellaStatus: TaskStatus.SetupFailed,
    count: 5,
    statuses: [TaskStatus.SetupFailed],
    color: purple.light2,
  },
];

export { versions, groupedTaskStats, groupedTaskStatsAll };
