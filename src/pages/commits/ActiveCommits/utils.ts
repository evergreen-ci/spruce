import { mapTaskStatusToUmbrellaStatus } from "constants/task";
import { ColorCount } from "pages/commits/types";
import { ChartTypes } from "types/commits";

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
  getStatusesWithZeroCount,
  injectGlobalDimStyle,
  injectGlobalHighlightStyle,
  removeGlobalDimStyle,
  removeGlobalHighlightStyle,
  roundMax,
};
