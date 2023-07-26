import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import {
  findMaxGroupedTaskStats,
  getAllTaskStatsGroupedByColor,
} from "pages/commits/utils";
import { ChartTypes, Commits } from "types/commits";
import { CommitBarChart } from ".";

export default {
  component: CommitBarChart,
  title: "Pages/Commits/Charts/ActiveCommit/CommitBarChart",
};

export const Default: StoryObj<typeof CommitBarChart> = {
  argTypes: {
    chartType: {
      control: { type: "select" },
      options: ChartTypes,
    },
  },
  args: {
    chartType: ChartTypes.Absolute,
  },
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
};

const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
const versions: Commits = [
  {
    rolledUpVersions: null,
    version: {
      author: "Mohamed Khelif",
      createTime: new Date("2021-06-16T23:38:13Z"),
      id: "123",
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      order: 25,
      projectIdentifier: "spruce",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        counts: [
          { count: 6, status: "success" },
          { count: 2, status: "failed" },
          { count: 4, status: "dispatched" },
          { count: 5, status: "started" },
          { count: 2, status: "will-run" },
        ],
        eta: new Date(Date.now() + 9999999),
      },
    },
  },
  {
    rolledUpVersions: null,
    version: {
      author: "Arjun Patel",
      createTime: new Date("2021-06-16T23:38:13Z"),
      id: "12",
      message: "SERVER-57333 Some complicated server commit",
      order: 24,
      projectIdentifier: "spruce",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        counts: [
          { count: 4, status: "blocked" },
          { count: 3, status: "aborted" },
          { count: 5, status: "undispatched" },
          { count: 2, status: "test-timed-out" },
        ],
        eta: null,
      },
    },
  },
  {
    rolledUpVersions: null,
    version: {
      author: "Mohamed Khelif",
      createTime: new Date("2021-06-16T23:38:13Z"),
      id: "13",
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      order: 23,
      projectIdentifier: "spruce",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        counts: [
          { count: 4, status: "success" },
          { count: 3, status: "inactive" },
          { count: 5, status: "pending" },
          { count: 2, status: "aborted" },
        ],
        eta: null,
      },
    },
  },
  {
    rolledUpVersions: null,
    version: {
      author: "Arjun Patel",
      createTime: new Date("2021-06-16T23:38:13Z"),
      id: "14",
      message: "SERVER-57333 Some complicated server commit",
      order: 22,
      projectIdentifier: "spruce",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        counts: [
          { count: 4, status: "blocked" },
          { count: 3, status: "aborted" },
          { count: 5, status: "undispatched" },
          { count: 2, status: "test-timed-out" },
        ],
        eta: null,
      },
    },
  },
  {
    rolledUpVersions: null,
    version: {
      author: "Elena Chen",
      createTime: new Date("2021-06-16T23:38:13Z"),
      id: "15",
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      order: 21,
      projectIdentifier: "spruce",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        counts: [
          { count: 4, status: "setup-failed" },
          { count: 3, status: "inactive" },
          { count: 5, status: "pending" },
          { count: 2, status: "unstarted" },
        ],
        eta: null,
      },
    },
  },
  {
    rolledUpVersions: null,
    version: {
      author: "Sophie Stadler",
      createTime: new Date("2021-06-16T23:38:13Z"),
      id: "16",
      message: "SERVER-57333 Some complicated server commit",
      order: 20,
      projectIdentifier: "spruce",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        counts: [
          { count: 6, status: "system-failed" },
          { count: 2, status: "pending" },
          { count: 4, status: "known-issue" },
          { count: 12, status: "unscheduled" },
          { count: 2, status: "task-timed-out" },
        ],
        eta: null,
      },
    },
  },
  {
    rolledUpVersions: null,
    version: {
      author: "Sophie Stadler",
      createTime: new Date("2021-06-16T23:38:13Z"),
      id: "17",
      message: "SERVER-57333 Some complicated server commit",
      order: 19,
      projectIdentifier: "spruce",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        counts: [
          { count: 4, status: "system-timed-out" },
          { count: 3, status: "system-unresponsive" },
          { count: 5, status: "setup-failed" },
          { count: 2, status: "unscheduled" },
        ],
        eta: null,
      },
    },
  },
];

const groupedTaskData = getAllTaskStatsGroupedByColor(versions);
const { max } = findMaxGroupedTaskStats(groupedTaskData);
