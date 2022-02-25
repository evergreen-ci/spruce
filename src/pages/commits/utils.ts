import { MainlineCommitsQueryVariables } from "gql/generated/types";
import { TaskStatus } from "types/task";
import { array } from "utils";

const { arraySetDifference, arrayIntersection } = array;

interface FilterState {
  statuses: string[];
  tasks: string[];
  variants: string[];
  requesters: string[];
}
interface MainlineCommitOptions {
  projectID: string;
  limit: number;
  skipOrderNumber: number;
}
interface CommitsPageReducerState {
  filterState: FilterState;
  mainlineCommitOptions: MainlineCommitOptions;
}

const getMainlineCommitsQueryVariables = (
  state: CommitsPageReducerState
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
const getFilterStatus = (state: FilterState) => ({
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
  state: CommitsPageReducerState
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
  state: CommitsPageReducerState
): MainlineCommitsQueryVariables["buildVariantOptions"] => {
  const { filterState } = state;
  const { hasTasks, hasFilters, hasStatuses } = getFilterStatus(filterState);

  let statusesToShow = FAILED_STATUSES as string[];

  if (hasFilters && !hasTasks && !hasStatuses) {
    statusesToShow = [];
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
    statuses: statusesToShow,
  };
  return buildVariantOptions;
};

const generateBuildVariantOptionsForGroupedTasksFromState = (
  state: CommitsPageReducerState
): MainlineCommitsQueryVariables["buildVariantOptionsForGroupedTasks"] => {
  const { filterState } = state;
  const { hasTasks, hasFilters, hasStatuses } = getFilterStatus(filterState);
  const { statuses } = filterState;

  let shouldShowGroupedTasks = false;
  let statusesToShow = [];

  if (hasFilters && !hasTasks) {
    statusesToShow = statuses;
    shouldShowGroupedTasks = true;
  }
  if (hasStatuses && !hasTasks) {
    statusesToShow = arraySetDifference(statuses, FAILED_STATUSES);
    shouldShowGroupedTasks = true;
  }

  // If we have tasks or every task status filter is failed we don't want grouped tasks
  if (
    hasTasks ||
    (hasStatuses && arraySetDifference(statuses, FAILED_STATUSES).length === 0)
  ) {
    shouldShowGroupedTasks = false;
  }
  const groupedBuildVariantOptions = {
    tasks: shouldShowGroupedTasks ? filterState.tasks : [impossibleMatch],
    variants: filterState.variants,
    statuses: statusesToShow,
  };

  return groupedBuildVariantOptions;
};

const generateBuildVariantOptionsForGraphFromState = (
  state: CommitsPageReducerState
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
  state: CommitsPageReducerState
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

const impossibleMatch = "^\b$"; // this will never match anything

export {
  impossibleMatch,
  getFilterStatus,
  getMainlineCommitsQueryVariables,
  FAILED_STATUSES,
};
