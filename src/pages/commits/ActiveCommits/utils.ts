import { mapTaskStatusToUmbrellaStatus } from "constants/task";
import { ChartTypes } from "types/commits";
import { groupStatusesByColor } from "utils/statuses";

export type ColorCount = {
  count: number;
  statuses: string[];
  color: string;
  umbrellaStatus: string;
};

export type GroupedResult = {
  stats: ColorCount[];
  max: number;
  total: number;
};

export const findMaxGroupedTaskStats = (groupedTaskStats: {
  [id: string]: GroupedResult;
}) => {
  if (Object.keys(groupedTaskStats).length === 0) {
    return { max: 0 };
  }
  return Object.values(groupedTaskStats).reduce((prev, curr) =>
    prev.max > curr.max ? prev : curr
  );
};

export const getAllTaskStatsGroupedByColor = (
  versions: {
    version?: {
      id: string;
      taskStatusCounts?: {
        status: string;
        count: number;
      }[];
    };
  }[]
) => {
  const idToGroupedTaskStats: { [id: string]: GroupedResult } = {};
  versions.forEach(({ version }) => {
    if (version != null) {
      idToGroupedTaskStats[version.id] = groupStatusesByColor(
        version.taskStatusCounts
      );
    }
  });

  return idToGroupedTaskStats;
};

// Used in Commit Chart Component to calculate bar heights
export function calculateBarHeight(
  value: number,
  max: number,
  total: number,
  chartType: string
) {
  if (chartType === ChartTypes.Percentage) {
    return `${(value / total) * 100}%`;
  }
  return `${(value / max) * 100}%`;
}

// Find zero count statuses for commit chart tooltip
export const getStatusesWithZeroCount = (colors: ColorCount[]) => {
  const availableStatuses = colors.map(({ umbrellaStatus }) => umbrellaStatus);
  const allStatuses = Object.values(mapTaskStatusToUmbrellaStatus);
  return Array.from(
    new Set(allStatuses.filter((status) => !availableStatuses.includes(status)))
  );
};
