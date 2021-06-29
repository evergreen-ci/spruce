import { CommitChart } from "pages/commits/commitChart/CommitChart";
import { groupTasksByColor } from "pages/commits/commitChart/utils";
import {
  FlexRowContainer,
  findMaxGroupedTaskStats,
} from "pages/commits/CommitsWrapper";

export default {
  title: "Commit Charts",
  component: CommitChart,
};

export const AbsoluteChart = () => (
  <FlexRowContainer>
    {groupedTaskData.map((item) => (
      <CommitChart
        groupedTaskStats={item.stats}
        total={item.total}
        max={max}
        chartType="absolute"
      />
    ))}
  </FlexRowContainer>
);

export const PercentChart = () => (
  <FlexRowContainer>
    {groupedTaskData.map((item) => (
      <CommitChart
        groupedTaskStats={item.stats}
        total={item.total}
        max={-1}
        chartType="percentage"
      />
    ))}
  </FlexRowContainer>
);

const taskData = [
  {
    statusCounts: [
      { status: "Succeeded", count: 6 },
      { status: "Failed", count: 2 },
      { status: "Dispatched", count: 4 },
      { status: "Unscheduled", count: 5 },
      { status: "WillRun", count: 2 },
    ],
  },
  {
    statusCounts: [
      { status: "Succeeded", count: 4 },
      { status: "Failed", count: 3 },
      { status: "Dispatched", count: 5 },
      { status: "Unscheduled", count: 2 },
    ],
  },
  {
    statusCounts: [
      { status: "Succeeded", count: 4 },
      { status: "Failed", count: 3 },
      { status: "Dispatched", count: 5 },
      { status: "Unscheduled", count: 2 },
    ],
  },
  {
    statusCounts: [
      { status: "Succeeded", count: 6 },
      { status: "Pending", count: 2 },
      { status: "KnownIssue", count: 4 },
      { status: "Unscheduled", count: 12 },
      { status: "TaskTimedOut", count: 2 },
    ],
  },
  {
    statusCounts: [
      { status: "Succeeded", count: 4 },
      { status: "Failed", count: 3 },
      { status: "Dispatched", count: 5 },
      { status: "Unscheduled", count: 2 },
    ],
  },
];

const groupedTaskData = taskData.map((item) =>
  groupTasksByColor(item.statusCounts)
);
const max = findMaxGroupedTaskStats(groupedTaskData);
