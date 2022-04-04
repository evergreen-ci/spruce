import { TestStatus } from "types/history";

const queryParamsToDisplay = new Set([
  TestStatus.Failed,
  TestStatus.Passed,
  TestStatus.All,
]);

const FOLDED_COMMITS_HEIGHT = 40;
const COMMIT_HEIGHT = 120;
const DATE_SEPARATOR_HEIGHT = 40;
const DEFAULT_COLUMN_LIMIT = 7;
const COLUMN_LABEL_WIDTH = 150;
const ROW_LABEL_WIDTH = 200;
const LOADING_HEIGHT = 100;

export {
  queryParamsToDisplay,
  FOLDED_COMMITS_HEIGHT,
  COMMIT_HEIGHT,
  DATE_SEPARATOR_HEIGHT,
  DEFAULT_COLUMN_LIMIT,
  COLUMN_LABEL_WIDTH,
  ROW_LABEL_WIDTH,
  LOADING_HEIGHT,
};
