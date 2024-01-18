import { TaskStatus } from "types/task";
import { arraySetDifference } from "utils/array";

const commitChartHeight = 224;
const gridHeight = 226;

const TASK_ICONS_PER_ROW = 6;
const TASK_ICON_HEIGHT = 24;
const TASK_ICON_PADDING = 8;

const GROUPED_BADGES_PER_ROW = 2;
const GROUPED_BADGE_HEIGHT = 40;
const GROUPED_BADGE_PADDING = 4;

const FAILED_STATUSES = [
  TaskStatus.Failed,
  TaskStatus.TaskTimedOut,
  TaskStatus.TestTimedOut,
  TaskStatus.KnownIssue,
  TaskStatus.SetupFailed,
  TaskStatus.SystemFailed,
  TaskStatus.SystemTimedOut,
  TaskStatus.SystemUnresponsive,
  TaskStatus.Aborted,
];
const ALL_STATUSES = Object.values(TaskStatus);
const ALL_NON_FAILING_STATUSES = arraySetDifference(
  ALL_STATUSES,
  FAILED_STATUSES,
);

const impossibleMatch = "^\b$"; // this will never match anything

export {
  commitChartHeight,
  gridHeight,
  TASK_ICONS_PER_ROW,
  TASK_ICON_HEIGHT,
  TASK_ICON_PADDING,
  GROUPED_BADGES_PER_ROW,
  GROUPED_BADGE_HEIGHT,
  GROUPED_BADGE_PADDING,
  FAILED_STATUSES,
  ALL_STATUSES,
  ALL_NON_FAILING_STATUSES,
  impossibleMatch,
};
