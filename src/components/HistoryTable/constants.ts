import { TestStatus } from "types/history";

const queryParamsToDisplay = new Set([
  TestStatus.Failed,
  TestStatus.Passed,
  TestStatus.All,
]);

const FOLDED_COMMITS_HEIGHT = 40;
const COMMIT_HEIGHT = 120;
const DATE_SEPARATOR_HEIGHT = 40;
const LOADING_HEIGHT = 100;

export {
  queryParamsToDisplay,
  FOLDED_COMMITS_HEIGHT,
  COMMIT_HEIGHT,
  DATE_SEPARATOR_HEIGHT,
  LOADING_HEIGHT,
};
