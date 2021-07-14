import { ChartTypes } from "types/commits";
import { FlexRowContainer } from "../CommitsWrapper";
import { CommitChart } from "./CommitChart";
import {
  findMaxGroupedTaskStats,
  getAllTaskStatsGroupedByColor,
} from "./utils";

export default {
  title: "Commit Charts",
  component: CommitChart,
};

export const AbsoluteChart = () => (
  <FlexRowContainer>
    {versions.map((item) =>
      item.version ? (
        <CommitChart
          key={item.version.id}
          groupedTaskStats={groupedTaskData[item.version.id].stats}
          total={groupedTaskData[item.version.id].total}
          max={max}
          chartType={ChartTypes.Absolute}
        />
      ) : null
    )}
  </FlexRowContainer>
);

export const PercentChart = () => (
  <FlexRowContainer>
    {versions.map((item) =>
      item.version ? (
        <CommitChart
          key={item.version.id}
          groupedTaskStats={groupedTaskData[item.version.id].stats}
          total={groupedTaskData[item.version.id].total}
          max={max}
          chartType={ChartTypes.Percentage}
        />
      ) : null
    )}
  </FlexRowContainer>
);

const versions = [
  {
    version: {
      id: "123",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      author: "Mohamed Khelif",
      githash: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: "Succeeded", count: 6 },
        { status: "Failed", count: 2 },
        { status: "Dispatched", count: 4 },
        { status: "Started", count: 5 },
        { status: "WillRun", count: 2 },
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
      githash: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: "Blocked", count: 4 },
        { status: "Aborted", count: 3 },
        { status: "Undispatched", count: 5 },
        { status: "TestTimedOut", count: 2 },
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
      githash: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: "Succeeded", count: 4 },
        { status: "Inactive", count: 3 },
        { status: "Pending", count: 5 },
        { status: "Aborted", count: 2 },
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
      githash: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: "Blocked", count: 4 },
        { status: "Aborted", count: 3 },
        { status: "Undispatched", count: 5 },
        { status: "TestTimedOut", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "15",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      author: "Elena Chen",
      githash: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: "SetupFailed", count: 4 },
        { status: "Inactive", count: 3 },
        { status: "Pending", count: 5 },
        { status: "Unstarted", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "16",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      author: "Sophie Stadler",
      githash: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: "SystemFailed", count: 6 },
        { status: "Pending", count: 2 },
        { status: "KnownIssue", count: 4 },
        { status: "Unscheduled", count: 12 },
        { status: "TaskTimedOut", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "17",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      author: "Sophie Stadler",
      githash: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: "SystemTimedOut", count: 4 },
        { status: "SystemUnresponsive", count: 3 },
        { status: "SetupFailed", count: 5 },
        { status: "Unscheduled", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
];

const groupedTaskData = getAllTaskStatsGroupedByColor(versions);
const max = findMaxGroupedTaskStats(groupedTaskData);
