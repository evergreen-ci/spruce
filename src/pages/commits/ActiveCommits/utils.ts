import { mapTaskStatusToUmbrellaStatus } from "constants/task";
import { ColorCount } from "pages/commits/types";
import { ChartTypes } from "types/commits";
import { roundMax } from "utils/numbers";

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
  chartType: string,
) => {
  if (chartType === ChartTypes.Percentage) {
    return `${(value / total) * 100}%`;
  }
  const roundedMax = roundMax(max);
  return `${(value / roundedMax) * 100}%`;
};

// Find zero count statuses for commit chart tooltip
const getStatusesWithZeroCount = (colors: ColorCount[]) => {
  const availableStatuses = colors.map(({ umbrellaStatus }) => umbrellaStatus);
  const allStatuses = Object.values(mapTaskStatusToUmbrellaStatus);
  return Array.from(
    new Set(
      allStatuses.filter((status) => !availableStatuses.includes(status)),
    ),
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
};
