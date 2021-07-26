import { sortedStatusColor } from "constants/task";
import { ChartTypes } from "types/commits";
import { groupStatusesByColor } from "utils/statuses";

export type ColorCount = { count: number; statuses: string[]; color: string };

export type GroupedResult = {
  stats: ColorCount[];
  max: number;
  total: number;
};

export const findMaxGroupedTaskStats = (groupedTaskStats: {
  [id: string]: GroupedResult;
}) =>
  Object.values(groupedTaskStats).reduce((prev, curr) =>
    prev.max > curr.max ? prev : curr
  );

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

// Find zero count status colors for commit chart tooltip
export function getZeroCountStatusColors(currColors: ColorCount[]) {
  const existingColorSet = new Set(currColors.map(({ color }) => color));
  return sortedStatusColor.filter((color) => !existingColorSet.has(color));
}
