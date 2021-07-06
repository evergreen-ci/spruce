import { CommitChart } from "pages/commits/commitChart/CommitChart";
import { groupStatusesByColor } from "pages/commits/commitChart/utils";
import {
  FlexRowContainer,
  findMaxGroupedTaskStats,
  ChartTypes,
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
        chartType={ChartTypes.Absolute}
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
        chartType={ChartTypes.Percentage}
      />
    ))}
  </FlexRowContainer>
);

const commitTaskStats = [
  [
    { status: "Succeeded", count: 6 },
    { status: "Failed", count: 2 },
    { status: "Dispatched", count: 4 },
    { status: "Started", count: 5 },
    { status: "WillRun", count: 2 },
  ],
  [
    { status: "Blocked", count: 4 },
    { status: "Aborted", count: 3 },
    { status: "Undispatched", count: 5 },
    { status: "TestTimedOut", count: 2 },
  ],
  [
    { status: "SetupFailed", count: 4 },
    { status: "Inactive", count: 3 },
    { status: "Pending", count: 5 },
    { status: "Unstarted", count: 2 },
  ],
  [
    { status: "SystemFailed", count: 6 },
    { status: "Pending", count: 2 },
    { status: "KnownIssue", count: 4 },
    { status: "Unscheduled", count: 12 },
    { status: "TaskTimedOut", count: 2 },
  ],
  [
    { status: "SystemTimedOut", count: 4 },
    { status: "SystemUnresponsive", count: 3 },
    { status: "SetupFailed", count: 5 },
    { status: "Unscheduled", count: 2 },
  ],
];

export const groupedTaskData = commitTaskStats.map((item) =>
  groupStatusesByColor(item)
);
export const max = findMaxGroupedTaskStats(groupedTaskData);
