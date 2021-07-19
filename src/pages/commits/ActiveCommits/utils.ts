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
export function calculateHeight(
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

export function getMissingColors(currColors: ColorCount[]) {
  const result = [...sortedStatusColor];
  currColors.forEach((colorCount) => {
    console.log(colorCount.color);
    const index = result.indexOf(colorCount.color);
    if (index > -1) {
      result.splice(index, 1);
    }
  });
  return result;
}
