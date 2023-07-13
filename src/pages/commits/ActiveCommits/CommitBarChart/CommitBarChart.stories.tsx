import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import {
  findMaxGroupedTaskStats,
  getAllTaskStatsGroupedByColor,
} from "pages/commits/utils";
import { ChartTypes, Commits } from "types/commits";
import { CommitBarChart } from ".";

export default {
  title: "Pages/Commits/Charts/ActiveCommit/CommitBarChart",
  component: CommitBarChart,
};

export const Default: StoryObj<typeof CommitBarChart> = {
  render: ({ chartType }) => (
    <FlexRowContainer>
      {versions.map((item) => (
        <CommitBarChart
          key={item.version.id}
          groupedTaskStats={groupedTaskData[item.version.id].stats}
          total={groupedTaskData[item.version.id].total}
          max={max}
          chartType={chartType}
          eta={item.version?.taskStatusStats?.eta}
        />
      ))}
    </FlexRowContainer>
  ),
  args: {
    chartType: ChartTypes.Absolute,
  },
  argTypes: {
    chartType: {
      options: ChartTypes,
      control: { type: "select" },
    },
  },
};

const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
const versions: Commits = [
  {
    version: {
      projectIdentifier: "spruce",
      id: "123",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Mohamed Khelif",
      order: 25,
      taskStatusStats: {
        eta: new Date(Date.now() + 9999999),
        counts: [
          { status: "success", count: 6 },
          { status: "failed", count: 2 },
          { status: "dispatched", count: 4 },
          { status: "started", count: 5 },
          { status: "will-run", count: 2 },
        ],
      },
    },
    rolledUpVersions: null,
  },
  {
    version: {
      projectIdentifier: "spruce",
      id: "12",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Arjun Patel",
      order: 24,
      taskStatusStats: {
        eta: null,
        counts: [
          { status: "blocked", count: 4 },
          { status: "aborted", count: 3 },
          { status: "undispatched", count: 5 },
          { status: "test-timed-out", count: 2 },
        ],
      },
    },
    rolledUpVersions: null,
  },
  {
    version: {
      projectIdentifier: "spruce",
      id: "13",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Mohamed Khelif",
      order: 23,
      taskStatusStats: {
        eta: null,
        counts: [
          { status: "success", count: 4 },
          { status: "inactive", count: 3 },
          { status: "pending", count: 5 },
          { status: "aborted", count: 2 },
        ],
      },
    },
    rolledUpVersions: null,
  },
  {
    version: {
      projectIdentifier: "spruce",
      id: "14",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Arjun Patel",
      order: 22,
      taskStatusStats: {
        eta: null,
        counts: [
          { status: "blocked", count: 4 },
          { status: "aborted", count: 3 },
          { status: "undispatched", count: 5 },
          { status: "test-timed-out", count: 2 },
        ],
      },
    },
    rolledUpVersions: null,
  },
  {
    version: {
      projectIdentifier: "spruce",
      id: "15",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Elena Chen",
      order: 21,
      taskStatusStats: {
        eta: null,
        counts: [
          { status: "setup-failed", count: 4 },
          { status: "inactive", count: 3 },
          { status: "pending", count: 5 },
          { status: "unstarted", count: 2 },
        ],
      },
    },
    rolledUpVersions: null,
  },
  {
    version: {
      projectIdentifier: "spruce",
      id: "16",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Sophie Stadler",
      order: 20,
      taskStatusStats: {
        eta: null,
        counts: [
          { status: "system-failed", count: 6 },
          { status: "pending", count: 2 },
          { status: "known-issue", count: 4 },
          { status: "unscheduled", count: 12 },
          { status: "task-timed-out", count: 2 },
        ],
      },
    },
    rolledUpVersions: null,
  },
  {
    version: {
      projectIdentifier: "spruce",
      id: "17",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Sophie Stadler",
      order: 19,
      taskStatusStats: {
        eta: null,
        counts: [
          { status: "system-timed-out", count: 4 },
          { status: "system-unresponsive", count: 3 },
          { status: "setup-failed", count: 5 },
          { status: "unscheduled", count: 2 },
        ],
      },
    },
    rolledUpVersions: null,
  },
];

const groupedTaskData = getAllTaskStatsGroupedByColor(versions);
const { max } = findMaxGroupedTaskStats(groupedTaskData);
