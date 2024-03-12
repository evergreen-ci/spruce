import { LastMainlineCommitQuery } from "gql/generated/types";
import { reportError } from "utils/errorReporting";

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

export type CommitTask =
  LastMainlineCommitQuery["mainlineCommits"]["versions"][number]["version"]["buildVariants"][number]["tasks"][number];
