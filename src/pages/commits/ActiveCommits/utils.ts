import { mapTaskStatusToUmbrellaStatus } from "constants/task";
import { ChartTypes, Commits, BuildVariantDict } from "types/commits";
import { groupStatusesByUmbrellaStatus } from "utils/statuses";
import {
  TASK_ICONS_PER_ROW,
  TASK_ICON_HEIGHT,
  TASK_ICON_PADDING,
  GROUPED_BADGES_PER_ROW,
  GROUPED_BADGE_HEIGHT,
  GROUPED_BADGE_PADDING,
} from "../constants";

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

export const getAllTaskStatsGroupedByColor = (versions: Commits) => {
  const idToGroupedTaskStats: { [id: string]: GroupedResult } = {};
  versions.forEach(({ version }) => {
    if (version != null) {
      idToGroupedTaskStats[version.id] = groupStatusesByUmbrellaStatus(
        version.taskStatusStats?.counts
      );
    }
  });

  return idToGroupedTaskStats;
};

export const constructBuildVariantDict = (
  versions: Commits
): BuildVariantDict => {
  const buildVariantDict: BuildVariantDict = {};

  for (let i = 0; i < versions.length; i++) {
    const { version } = versions[i];

    // skip if inactive/unmatching
    if (version) {
      // Deduplicate build variants and build variant stats by consolidating into a single object.
      const allBuildVariants = [
        ...version.buildVariants,
        ...version.buildVariantStats,
      ].reduce((acc, curr) => {
        const { variant } = curr;
        acc[variant] = { ...acc[variant], ...curr };
        return acc;
      }, {});

      // Construct build variant dict which will contain information needed for rendering.
      Object.values(allBuildVariants).reduce(
        (acc, { tasks, statusCounts, variant }) => {
          // Determine height to allocate for icons.
          let iconHeight = 0;
          if (tasks) {
            const numRows = Math.ceil(tasks.length / TASK_ICONS_PER_ROW);
            const iconContainerHeight = numRows * TASK_ICON_HEIGHT;
            const iconContainerPadding = TASK_ICON_PADDING * 2;
            iconHeight = iconContainerHeight + iconContainerPadding;
          }

          // Determine height to allocate for grouped badges.
          let badgeHeight = 0;
          if (statusCounts) {
            const numRows = Math.ceil(
              statusCounts.length / GROUPED_BADGES_PER_ROW
            );
            const badgeContainerHeight = numRows * GROUPED_BADGE_HEIGHT;
            const badgeContainerPadding = GROUPED_BADGE_PADDING * 2;
            badgeHeight = badgeContainerHeight + badgeContainerPadding;
          }

          if (acc[variant]) {
            if (iconHeight > acc[variant].iconHeight) {
              acc[variant].iconHeight = iconHeight;
            }
            if (badgeHeight > acc[variant].badgeHeight) {
              acc[variant].badgeHeight = badgeHeight;
            }
            acc[variant].priority += 1;
          } else {
            acc[variant] = { priority: 1, iconHeight, badgeHeight };
          }
          return acc;
        },
        buildVariantDict
      );
    }
  }
  return buildVariantDict;
};

/**
 * Calculates the height of a bar in a bar chart
 * @param value - the value of the bar to calculate the height of
 * @param max - the largest value in the bar chart
 * @param total - the total amount of values in the bar chart
 * @param chartType - the type of chart (percentage or absolute)
 * @returns the percentage height of the bar
 */
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

// Functions for injecting and removing style for hovering on task icons
const taskIconStyle = "task-icon-style";

export const removeGlobalStyle = () => {
  document.getElementById(taskIconStyle)?.remove();
};

export const injectGlobalStyle = (taskIdentifier: string) => {
  // Remove style here again because hovering over LG tooltips triggers two consecutive mouseenter events.
  removeGlobalStyle();

  const hoverStyle = document.createElement("style");
  hoverStyle.id = taskIconStyle;
  hoverStyle.innerHTML = `
    div[data-task-icon]:not([data-task-icon="${taskIdentifier}"]) {
        opacity: 0.25;
    }
  `;
  document.getElementsByTagName("head")[0].appendChild(hoverStyle);
};
