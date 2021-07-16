import { MainlineCommitsQuery } from "gql/generated/types";
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
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"]
) => {
  const idToGroupedTaskStats: { [id: string]: GroupedResult } = {};
  versions.forEach((versionObj) => {
    if (versionObj.version != null) {
      idToGroupedTaskStats[versionObj.version.id] = groupStatusesByColor(
        versionObj.version.taskStatusCounts
      );
    }
  });

  return idToGroupedTaskStats;
};
