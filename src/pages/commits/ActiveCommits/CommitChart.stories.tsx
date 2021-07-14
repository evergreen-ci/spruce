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
        { status: "success", count: 6 },
        { status: "failed", count: 2 },
        { status: "dispatched", count: 4 },
        { status: "started", count: 5 },
        { status: "will-run", count: 2 },
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
        { status: "blocked", count: 4 },
        { status: "aborted", count: 3 },
        { status: "undispatched", count: 5 },
        { status: "test-timed-out", count: 2 },
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
        { status: "success", count: 4 },
        { status: "inactive", count: 3 },
        { status: "pending", count: 5 },
        { status: "aborted", count: 2 },
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
        { status: "blocked", count: 4 },
        { status: "aborted", count: 3 },
        { status: "undispatched", count: 5 },
        { status: "test-timed-out", count: 2 },
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
        { status: "setup-failed", count: 4 },
        { status: "inactive", count: 3 },
        { status: "pending", count: 5 },
        { status: "unstarted", count: 2 },
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
        { status: "system-failed", count: 6 },
        { status: "pending", count: 2 },
        { status: "known-issue", count: 4 },
        { status: "unscheduled", count: 12 },
        { status: "task-timed-out", count: 2 },
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
        { status: "system-timed-out", count: 4 },
        { status: "system-unresponsive", count: 3 },
        { status: "setup-failed", count: 5 },
        { status: "unscheduled", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
];

const groupedTaskData = getAllTaskStatsGroupedByColor(versions);
const { max } = findMaxGroupedTaskStats(groupedTaskData);
