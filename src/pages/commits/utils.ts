import { MainlineCommitsQueryVariables } from "gql/generated/types";
import { TaskStatus } from "types/task";
import { array } from "utils";

const { arraySetDifference, arrayIntersection } = array;

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

const getMainlineCommitsQueryVariables = (
  state: commitsPageReducerState
): MainlineCommitsQueryVariables => {
  const variables = {
    mainlineCommitsOptions: generateMainlineCommitOptionsFromState(state),
    buildVariantOptions: generateBuildVariantOptionsFromState(state),
    buildVariantOptionsForGraph: generateBuildVariantOptionsForGraphFromState(
      state
    ),
    buildVariantOptionsForGroupedTasks: generateBuildVariantOptionsForGroupedTasksFromState(
      state
    ),
    buildVariantOptionsForTaskIcons: generateBuildVariantOptionsForTaskIconsFromState(
      state
    ),
  };
  return variables;
};

/** getFilterStatus returns an object containing booleans that describe what filters have been applied. */
const getFilterStatus = (state: filterState) => ({
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
) => {
  const { filterState } = state;
  const { statuses, tasks, variants } = filterState;

  const buildVariantOptions = {
    tasks,
    variants,
    statuses,
  };

  return buildVariantOptions;
};

const generateBuildVariantOptionsForTaskIconsFromState = (
  state: commitsPageReducerState
): MainlineCommitsQueryVariables["buildVariantOptions"] => {
  const { filterState } = state;
  const { hasTasks, hasFilters, hasStatuses } = getFilterStatus(filterState);

  let statusesToShow = FAILED_STATUSES as string[];

  if (hasFilters && !hasTasks && !hasStatuses) {
    statusesToShow = arraySetDifference(statusesToShow, filterState.statuses);
  }
  if (hasStatuses && !hasTasks) {
    statusesToShow = arrayIntersection(FAILED_STATUSES, filterState.statuses);
  }
  if (hasTasks) {
    statusesToShow = filterState.statuses;
  }

  const shouldShowIcons = hasTasks || statusesToShow.length > 0;
  const buildVariantOptions = {
    tasks: shouldShowIcons ? filterState.tasks : [impossibleMatch],
    variants: filterState.variants,
    statuses: shouldShowIcons ? statusesToShow : [],
  };
  return buildVariantOptions;
};

const generateBuildVariantOptionsForGroupedTasksFromState = (
  state: commitsPageReducerState
): MainlineCommitsQueryVariables["buildVariantOptionsForGroupedTasks"] => {
  const { filterState } = state;
  const { hasTasks, hasFilters, hasStatuses } = getFilterStatus(filterState);
  const { statuses } = filterState;

  const updatedStatuses = hasStatuses
    ? arraySetDifference(statuses, FAILED_STATUSES)
    : arraySetDifference(allStatuses, FAILED_STATUSES);

  const shouldShowGroupedBuildVariants = hasFilters && !hasTasks;

  const groupedBuildVariantOptions = {
    tasks: shouldShowGroupedBuildVariants
      ? filterState.tasks
      : [impossibleMatch], // this is a hack to make the query fail
    variants: filterState.variants,
    statuses: shouldShowGroupedBuildVariants ? updatedStatuses : [],
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

const allStatuses = Object.values(TaskStatus);

const impossibleMatch = "^\b$"; // this will never match anything

export {
  impossibleMatch,
  getFilterStatus,
  getMainlineCommitsQueryVariables,
  FAILED_STATUSES,
};
