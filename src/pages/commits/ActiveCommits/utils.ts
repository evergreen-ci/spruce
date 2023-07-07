import { mapTaskStatusToUmbrellaStatus } from "constants/task";
import { ColorCount } from "pages/commits/types";
import { ChartTypes, Commits, BuildVariantDict } from "types/commits";
import {
  TASK_ICONS_PER_ROW,
  TASK_ICON_HEIGHT,
  TASK_ICON_PADDING,
  GROUPED_BADGES_PER_ROW,
  GROUPED_BADGE_HEIGHT,
  GROUPED_BADGE_PADDING,
} from "../constants";

const constructBuildVariantDict = (versions: Commits): BuildVariantDict => {
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
 * `calculateBarHeight` calculates the height of a single bar in a bar chart.
 * @param value - the value of the bar to calculate the height of
 * @param max - the largest value in the bar chart
 * @param total - the total amount of values in the bar chart
 * @param chartType - the type of chart (percentage or absolute)
 * @returns the percentage height of the bar
 */
const calculateBarHeight = (
  value: number,
  max: number,
  total: number,
  chartType: string
) => {
  if (chartType === ChartTypes.Percentage) {
    return `${(value / total) * 100}%`;
  }
  const roundedMax = roundMax(max);
  return `${(value / roundedMax) * 100}%`;
};

const roundMax = (max: number) => {
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
const getStatusesWithZeroCount = (colors: ColorCount[]) => {
  const availableStatuses = colors.map(({ umbrellaStatus }) => umbrellaStatus);
  const allStatuses = Object.values(mapTaskStatusToUmbrellaStatus);
  return Array.from(
    new Set(allStatuses.filter((status) => !availableStatuses.includes(status)))
  );
};

// Functions for injecting and removing style for hovering on task icons
const dimIconStyle = "dim-icon-style";

const removeGlobalDimStyle = () => {
  document.getElementById(dimIconStyle)?.remove();
};

const injectGlobalDimStyle = () => {
  // Remove style here again because hovering over LG tooltips triggers two consecutive mouseenter events.
  removeGlobalDimStyle();

  const hoverStyle = document.createElement("style");
  hoverStyle.id = dimIconStyle;
  hoverStyle.innerHTML = `
    div[data-task-icon] {
        opacity: 0.25;
    }
  `;
  document.getElementsByTagName("head")[0].appendChild(hoverStyle);
};

// Functions for injecting and removing style for hovering on task icons
const taskIconStyle = "task-icon-style";

const removeGlobalHighlightStyle = () => {
  document.getElementById(taskIconStyle)?.remove();
};

const injectGlobalHighlightStyle = (taskIdentifier: string) => {
  // Remove style here again because hovering over LG tooltips triggers two consecutive mouseenter events.
  removeGlobalHighlightStyle();

  const hoverStyle = document.createElement("style");
  hoverStyle.id = taskIconStyle;
  hoverStyle.innerHTML = `
     [data-task-icon="${taskIdentifier}"] {
         opacity: 1 !important;
     }
   `;
  document.getElementsByTagName("head")[0].appendChild(hoverStyle);
};

export {
  calculateBarHeight,
  constructBuildVariantDict,
  getStatusesWithZeroCount,
  injectGlobalDimStyle,
  injectGlobalHighlightStyle,
  removeGlobalDimStyle,
  removeGlobalHighlightStyle,
  roundMax,
};
