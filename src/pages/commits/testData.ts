import { palette } from "@leafygreen-ui/palette";
import { TaskStatus } from "types/task";

const { gray, green, purple, red, yellow } = palette;

const buildVariant1 = {
  displayName: "Enterprise macOS C++20 DEBUG",
  tasks: [
    {
      displayName: "auth",
      execution: 0,
      failedTestCount: 0,
      id: "auth",
      status: TaskStatus.WillRun,
    },
  ],
  variant: "enterprise-macos-cxx20",
};

const buildVariant2 = {
  displayName: "~ Enterprise Windows (Benchmarks)",
  tasks: [
    {
      displayName: "benchmarks",
      execution: 0,
      failedTestCount: 0,
      id: "benchmarks",
      status: TaskStatus.Pending,
    },
  ],
  variant: "enterprise-windows-benchmarks",
};

const buildVariant3 = {
  displayName: "Enterprise RHEL 8.0 (inMemory)",
  tasks: [
    {
      displayName: "fuzzer",
      execution: 0,
      failedTestCount: 1,
      id: "fuzzer",
      status: TaskStatus.Failed,
    },
  ],
  variant: "enterprise-rhel-80-64-bit-inmem",
};

const buildVariantStat = {
  displayName: "Enterprise macOS C++20 DEBUG",
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
  variant: "enterprise-macos-cxx20",
};

const versions = [
  {
    rolledUpVersions: null,
    version: {
      author: "Mohamed Khelif",
      buildVariantStats: [buildVariantStat],
      buildVariants: [buildVariant1],
      createTime: new Date("2021-06-16T23:38:13Z"),
      gitTags: null,
      id: "123",
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      order: 39369,
      projectIdentifier: "mongodb-mongo-master",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        counts: [
          { count: 6, status: TaskStatus.TaskTimedOut },
          { count: 4, status: TaskStatus.Succeeded },
          { count: 3, status: TaskStatus.Started },
          { count: 5, status: TaskStatus.SystemFailed },
          { count: 2, status: TaskStatus.Unscheduled },
          { count: 3, status: TaskStatus.SetupFailed },
          { count: 2, status: TaskStatus.SystemUnresponsive },
        ],
        eta: null,
      },
    },
  },
  {
    rolledUpVersions: null,
    version: {
      author: "Arjun Patel",
      buildVariantStats: [],
      buildVariants: [buildVariant1, buildVariant2],
      createTime: new Date("2021-06-16T23:38:13Z"),
      gitTags: null,
      id: "12",
      message: "SERVER-57333 Some complicated server commit",
      order: 39368,
      projectIdentifier: "mongodb-mongo-master",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        counts: [
          { count: 6, status: TaskStatus.TestTimedOut },
          { count: 2, status: TaskStatus.Failed },
          { count: 4, status: TaskStatus.Dispatched },
          { count: 2, status: TaskStatus.WillRun },
          { count: 5, status: TaskStatus.SystemTimedOut },
          { count: 2, status: TaskStatus.SystemUnresponsive },
        ],
        eta: null,
      },
    },
  },
  {
    rolledUpVersions: null,
    version: {
      author: "Mohamed Khelif",
      buildVariantStats: [],
      buildVariants: [buildVariant1, buildVariant2, buildVariant3],
      createTime: new Date("2021-06-16T23:38:13Z"),
      gitTags: null,
      id: "13",
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      order: 39367,
      projectIdentifier: "mongodb-mongo-master",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        counts: [
          { count: 6, status: TaskStatus.Succeeded },
          { count: 2, status: TaskStatus.Failed },
          { count: 4, status: TaskStatus.Dispatched },
          { count: 5, status: TaskStatus.Started },
        ],
        eta: null,
      },
    },
  },
  {
    rolledUpVersions: null,
    version: {
      author: "Arjun Patel",
      buildVariantStats: [],
      buildVariants: [buildVariant1],
      createTime: new Date("2021-06-16T23:38:13Z"),
      gitTags: null,
      id: "14",
      message: "SERVER-57333 Some complicated server commit",
      order: 39366,
      projectIdentifier: "mongodb-mongo-master",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        counts: [
          { count: 6, status: TaskStatus.TaskTimedOut },
          { count: 4, status: TaskStatus.Succeeded },
          { count: 3, status: TaskStatus.Started },
          { count: 5, status: TaskStatus.SystemFailed },
          { count: 2, status: TaskStatus.Unscheduled },
          { count: 3, status: TaskStatus.SetupFailed },
          { count: 2, status: TaskStatus.SystemUnresponsive },
        ],
        eta: null,
      },
    },
  },
];

const groupedTaskStatsAll = [
  {
    color: green.dark1,
    count: 2,
    statuses: [TaskStatus.Succeeded],
    umbrellaStatus: TaskStatus.Succeeded,
  },
  {
    color: red.base,
    count: 1,
    statuses: [TaskStatus.Failed],
    umbrellaStatus: TaskStatus.FailedUmbrella,
  },
  {
    color: purple.dark2,
    count: 3,
    statuses: [TaskStatus.SystemFailed],
    umbrellaStatus: TaskStatus.SystemFailureUmbrella,
  },
  {
    color: purple.light2,
    count: 5,
    statuses: [TaskStatus.SetupFailed],
    umbrellaStatus: TaskStatus.SetupFailed,
  },
  {
    color: gray.dark1,
    count: 1,
    statuses: [TaskStatus.Unscheduled],
    umbrellaStatus: TaskStatus.Undispatched,
  },
  {
    color: yellow.base,
    count: 6,
    statuses: [TaskStatus.Started],
    umbrellaStatus: TaskStatus.RunningUmbrella,
  },
  {
    color: gray.dark1,
    count: 7,
    statuses: [TaskStatus.Dispatched],
    umbrellaStatus: TaskStatus.Dispatched,
  },
  {
    color: gray.dark1,
    count: 7,
    statuses: [TaskStatus.Inactive],
    umbrellaStatus: TaskStatus.Inactive,
  },
  {
    color: gray.dark1,
    count: 7,
    statuses: [TaskStatus.WillRun],
    umbrellaStatus: TaskStatus.ScheduledUmbrella,
  },
  {
    color: gray.dark1,
    count: 7,
    statuses: [TaskStatus.Unscheduled],
    umbrellaStatus: TaskStatus.UndispatchedUmbrella,
  },
];

const groupedTaskStats = [
  {
    color: green.dark1,
    count: 2,
    statuses: [TaskStatus.Succeeded],
    umbrellaStatus: TaskStatus.Succeeded,
  },
  {
    color: red.base,
    count: 1,
    statuses: [TaskStatus.Failed],
    umbrellaStatus: TaskStatus.Failed,
  },
  {
    color: gray.dark1,
    count: 1,
    statuses: [TaskStatus.Unscheduled],
    umbrellaStatus: TaskStatus.Unscheduled,
  },
  {
    color: purple.light2,
    count: 5,
    statuses: [TaskStatus.SetupFailed],
    umbrellaStatus: TaskStatus.SetupFailed,
  },
];

export { versions, groupedTaskStats, groupedTaskStatsAll };
