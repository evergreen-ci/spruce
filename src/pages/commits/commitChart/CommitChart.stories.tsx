import { CommitChart } from "pages/commits/commitChart/CommitChart";
import { FlexRowContainer } from "pages/commits/CommitsWrapper";

export default {
  title: "Commit Charts",
  component: CommitChart,
};

export const AbsoluteChart = () => (
  <FlexRowContainer>
    {taskData.map((value) => (
      <CommitChart taskStats={value} max={30} chartType="absolute" />
    ))}
  </FlexRowContainer>
);

export const PercentChart = () => (
  <FlexRowContainer>
    {taskData.map((value) => (
      <CommitChart taskStats={value} max={30} chartType="percentage" />
    ))}
  </FlexRowContainer>
);

const taskData = [
  {
    success: 6,
    failure: 2,
    dispatched: 4,
    scheduled: 2,
    unscheduled: 5,
    total: 19,
  },
  {
    success: 4,
    failure: 3,
    dispatched: 5,
    setupFailure: 2,
    total: 14,
  },
  {
    success: 30,
    total: 30,
  },
  {
    success: 3,
    failure: 4,
    dispatched: 6,
    scheduled: 5,
    unscheduled: 1,
    systemFailure: 4,
    setupFailure: 2,
    total: 25,
  },
  {
    success: 6,
    failure: 2,
    unscheduled: 5,
    total: 13,
  },
  {
    success: 4,
    failure: 3,
    dispatched: 5,
    total: 12,
  },
  {
    success: 10,
    failure: 20,
    total: 30,
  },
];
