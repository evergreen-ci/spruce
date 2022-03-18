import { TestStatus } from "types/history";

const queryParamsToDisplay = new Set([
  TestStatus.Failed,
  TestStatus.Passed,
  TestStatus.All,
]);

export { queryParamsToDisplay };
export const FOLDED_COMMITS_HEIGHT = 40;
export const COMMIT_HEIGHT = 120;
export const DATE_SEPARATOR_HEIGHT = 40;
export const DEFAULT_HEIGHT = 100;
