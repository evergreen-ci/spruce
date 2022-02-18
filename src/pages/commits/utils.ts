import { MainlineCommitsQueryVariables } from "gql/generated/types";
import { TaskStatus } from "types/task";
import { array } from "utils";

const { arraySetDifference } = array;

interface filterState {
  statuses: string[];
  tasks: string[];
  variants: string[];
  requesters: string[];
}
interface mainlineCommitOptions {
  projectID: string;
  limit: number;
  skipOrderNumber: number;
}
interface commitsPageReducerState {
  filterState: filterState;
  mainlineCommitOptions: mainlineCommitOptions;
}

export const getMainlineCommitsQueryVariables = (
  state: commitsPageReducerState
): MainlineCommitsQueryVariables => {
  const variables = {
    mainlineCommitsOptions: generateMainlineCommitOptionsFromState(state),
    buildVariantOptions: generateBuildVariantOptionsFromState(state),
    buildVariantOptionsForGraph: generateBuildVariantOptionsForGraphFromState(
      state
    ),
    groupedBuildVariantOptions: generateGroupedBuildVariantOptionsFromState(
      state
    ),
  };
  return variables;
};

/** getFilterStatus returns an object containing booleans that describe what filters have been applied. */
export const getFilterStatus = (state: filterState) => ({
  hasFilters:
    state.requesters.length > 0 ||
    state.statuses.length > 0 ||
    state.tasks.length > 0 ||
    state.variants.length > 0,
  hasRequesterFilter: state.requesters.length > 0,
  hasStatuses: state.statuses.length > 0,
  hasTasks: state.tasks.length > 0,
  hasVariants: state.variants.length > 0,
});

const generateBuildVariantOptionsFromState = (
  state: commitsPageReducerState
): MainlineCommitsQueryVariables["buildVariantOptions"] => {
  const { filterState } = state;
  const { hasTasks } = getFilterStatus(filterState);

  const updatedStatuses = hasTasks ? filterState.statuses : FAILED_STATUSES;
  const buildVariantOptions = {
    tasks: filterState.tasks,
    variants: filterState.variants,
    statuses: updatedStatuses,
  };
  return buildVariantOptions;
};

const generateGroupedBuildVariantOptionsFromState = (
  state: commitsPageReducerState
): MainlineCommitsQueryVariables["groupedBuildVariantOptions"] => {
  const { filterState } = state;
  const { hasTasks, hasFilters } = getFilterStatus(filterState);
  const { statuses } = filterState;

  const updatedStatuses = !hasTasks
    ? arraySetDifference(statuses, FAILED_STATUSES)
    : statuses;

  const groupedBuildVariantOptions = {
    tasks: hasFilters ? filterState.tasks : ["impossibleMatch123asd"],
    variants: filterState.variants,
    statuses: updatedStatuses,
  };
  return groupedBuildVariantOptions;
};

const generateBuildVariantOptionsForGraphFromState = (
  state: commitsPageReducerState
): MainlineCommitsQueryVariables["buildVariantOptionsForGraph"] => {
  const { filterState } = state;
  const buildVariantOptionsForGraph = {
    statuses: filterState.statuses,
    tasks: filterState.tasks,
    variants: filterState.variants,
  };
  return buildVariantOptionsForGraph;
};

const generateMainlineCommitOptionsFromState = (
  state: commitsPageReducerState
): MainlineCommitsQueryVariables["mainlineCommitsOptions"] => {
  const { filterState, mainlineCommitOptions } = state;
  const { hasFilters } = getFilterStatus(filterState);
  return {
    ...mainlineCommitOptions,
    shouldCollapse: hasFilters,
    requesters: filterState.requesters,
  };
};

const FAILED_STATUSES = [
  TaskStatus.Failed,
  TaskStatus.TaskTimedOut,
  TaskStatus.TestTimedOut,
  TaskStatus.KnownIssue,
  TaskStatus.Aborted,
];
