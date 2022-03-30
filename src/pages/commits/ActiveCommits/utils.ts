import { mapTaskStatusToUmbrellaStatus } from "constants/task";
import { ChartTypes } from "types/commits";
import { groupStatusesByUmbrellaStatus } from "utils/statuses";

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
      idToGroupedTaskStats[version.id] = groupStatusesByUmbrellaStatus(
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
  const roundedMax = roundMax(max);
  return `${(value / roundedMax) * 100}%`;
}

export const roundMax = (max: number) => {
  if (max < 100) {
    // Round up to nearest 10
    return Math.ceil(max / 10) * 10;
  }
  if (max < 500) {
    // Round up to nearest 50
    return Math.ceil(max / 50) * 50;
  }
  if (max < 1000) {
    // Round up to nearest 100
    return Math.ceil(max / 100) * 100;
  }
  if (max < 5000) {
    // Round up to nearest 500
    return Math.ceil(max / 500) * 500;
  }
  // Else round up to nearest 1000
  return Math.ceil(max / 1000) * 1000;
};

// Find zero count statuses for commit chart tooltip
export const getStatusesWithZeroCount = (colors: ColorCount[]) => {
  const availableStatuses = colors.map(({ umbrellaStatus }) => umbrellaStatus);
  const allStatuses = Object.values(mapTaskStatusToUmbrellaStatus);
  return Array.from(
    new Set(allStatuses.filter((status) => !availableStatuses.includes(status)))
  );
};

export const hoverTaskIcons = () => {
  const property = "data-task-icon";

  // find all icons on page
  const icons = document.querySelectorAll<HTMLElement>(
    `div[${property}^=icon_]`
  );
  // define mouseover and mouseout behavior for all icons
  for (let i = 0; i < icons.length; i++) {
    icons[i].onmouseover = () => {
      for (let j = 0; j < icons.length; j++) {
        if (
          icons[j].getAttribute(property) !== icons[i].getAttribute(property)
        ) {
          icons[j].style.opacity = "0.25";
        }
      }
    };
    icons[i].onmouseout = () => {
      for (let k = 0; k < icons.length; k++) {
        icons[k].style.opacity = "1";
      }
    };
  }
};
