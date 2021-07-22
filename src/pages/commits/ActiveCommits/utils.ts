import { groupStatusesByColor } from "utils/statuses";

export type ColorCount = { count: number; statuses: string[]; color: string };

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
