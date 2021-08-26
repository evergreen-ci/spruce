import { MainlineCommitsQuery } from "gql/generated/types";
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
  <FlexRowContainer numCommits={versions.length}>
    {versions.map((item) => (
      <CommitChart
        key={item.version.id}
        groupedTaskStats={groupedTaskData[item.version.id].stats}
        total={groupedTaskData[item.version.id].total}
        max={max}
        chartType={ChartTypes.Absolute}
      />
    ))}
  </FlexRowContainer>
);

export const PercentChart = () => (
  <FlexRowContainer numCommits={versions.length}>
    {versions.map((item) => (
      <CommitChart
        key={item.version.id}
        groupedTaskStats={groupedTaskData[item.version.id].stats}
        total={groupedTaskData[item.version.id].total}
        max={max}
        chartType={ChartTypes.Percentage}
      />
    ))}
  </FlexRowContainer>
);

const versions: MainlineCommitsQuery["mainlineCommits"]["versions"] = [
  {
    version: {
      id: "123",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Mohamed Khelif",
      order: 25,
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
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Arjun Patel",
      order: 24,
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
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Mohamed Khelif",
      order: 23,
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
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Arjun Patel",
      order: 22,
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
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Elena Chen",
      order: 21,
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
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Sophie Stadler",
      order: 20,
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
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Sophie Stadler",
      order: 19,
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
