import { getTaskRoute } from "constants/routes";
import { LastMainlineCommitQuery } from "gql/generated/types";
import { reportError } from "utils/errorReporting";
import { CommitTask, CommitType } from "./types";

// a link cannot be null, so it's common to use # as a substitute.
const nullLink = "#";

export const getLinks = ({
  breakingTask,
  lastExecutedTask,
  lastPassingTask,
  parentTask,
}: {
  breakingTask: CommitTask;
  lastExecutedTask: CommitTask;
  lastPassingTask: CommitTask;
  parentTask: CommitTask;
}) => {
  if (!parentTask) {
    return {
      [CommitType.Base]: nullLink,
      [CommitType.Breaking]: nullLink,
      [CommitType.LastPassing]: nullLink,
      [CommitType.LastExecuted]: nullLink,
    };
  }

  return {
    [CommitType.Base]: getTaskRoute(parentTask.id),
    [CommitType.Breaking]: breakingTask
      ? getTaskRoute(breakingTask.id)
      : nullLink,
    [CommitType.LastPassing]: getTaskRoute(
      lastPassingTask?.id || parentTask.id,
    ),
    [CommitType.LastExecuted]: getTaskRoute(
      lastExecutedTask?.id || parentTask.id,
    ),
  };
};

// The return value from GetLastMainlineCommitQuery has a lot of nested fields that may or may
// not exist. The logic to extract the task from it is written in this function.
export const getTaskFromMainlineCommitsQuery = (
  data: LastMainlineCommitQuery,
): CommitTask => {
  const buildVariants =
    data?.mainlineCommits.versions.find(({ version }) => version)?.version
      .buildVariants ?? [];
  if (buildVariants.length > 1) {
    reportError(
      new Error("Multiple build variants matched previous commit search."),
    ).warning();
  }
  if (buildVariants[0]?.tasks.length > 1) {
    reportError(
      new Error("Multiple tasks matched previous commit search."),
    ).warning();
  }
  return buildVariants[0]?.tasks[0];
};

export const getOrderFromMainlineCommitsQuery = (
  data: LastMainlineCommitQuery,
): number =>
  data?.mainlineCommits.versions.find(({ version }) => version)?.version
    .order ?? -1;
