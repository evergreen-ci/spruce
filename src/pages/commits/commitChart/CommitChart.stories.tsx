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
    Succeeded: 6,
    Failed: 2,
    Dispatched: 4,
    Unscheduled: 5,
    WillRun: 2,
    total: 19,
  },
  {
    Succeeded: 4,
    Failed: 3,
    Dispatched: 5,
    SetupFailed: 2,
    total: 14,
  },
  {
    Succeeded: 30,
    total: 30,
  },
  {
    Succeeded: 3,
    Failed: 4,
    Dispatched: 6,
    WillRun: 5,
    Unscheduled: 1,
    SystemFailed: 4,
    SetupFailed: 2,
    total: 25,
  },
  {
    Succeeded: 6,
    Failed: 20,
    Unscheduled: 5,
    total: 13,
  },
  {
    Succeeded: 4,
    Failed: 3,
    Dispatched: 5,
    total: 12,
  },
  {
    Succeeded: 10,
    Failed: 20,
    total: 30,
  },
];
