import { TestStatus } from "types/history";

const queryParamsToDisplay = new Set([
  TestStatus.Failed,
  TestStatus.Passed,
  TestStatus.All,
]);

export { queryParamsToDisplay };
