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

  let shouldShowTaskIcons = true;
  let statusesToShow = [];
  if (hasFilters) {
    if (hasTasks) {
      statusesToShow = filterState.statuses;
    } else if (hasStatuses) {
      const onlyHasNonFailingStatuses =
        arrayIntersection(filterState.statuses, FAILED_STATUSES).length === 0;
      if (onlyHasNonFailingStatuses) {
        shouldShowTaskIcons = false;
      } else {
        statusesToShow = arrayIntersection(
          filterState.statuses,
          FAILED_STATUSES
        );
      }
    } else {
      statusesToShow = FAILED_STATUSES;
    }
  } else {
    statusesToShow = FAILED_STATUSES;
  }

  const buildVariantOptions = {
    tasks: shouldShowTaskIcons ? filterState.tasks : [impossibleMatch],
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

  let statusesToShow = [];
  let shouldShowGroupedTaskIcons = true;
  if (hasTasks) {
    shouldShowGroupedTaskIcons = false;
  }
  if (hasFilters && shouldShowGroupedTaskIcons) {
    if (!hasStatuses) {
      statusesToShow = ALL_NON_FAILING_STATUSES;
    } else {
      const nonFailingStatusFilters = arrayIntersection(
        filterState.statuses,
        ALL_NON_FAILING_STATUSES
      );
      if (!nonFailingStatusFilters.length) {
        shouldShowGroupedTaskIcons = false;
      } else {
        statusesToShow = nonFailingStatusFilters;
      }
    }
  } else {
    shouldShowGroupedTaskIcons = false;
  }

  const groupedBuildVariantOptions = {
    tasks: shouldShowGroupedTaskIcons ? filterState.tasks : [impossibleMatch],
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

const ALL_STATUSES = Object.values(TaskStatus);
const ALL_NON_FAILING_STATUSES = arraySetDifference(
  ALL_STATUSES,
  FAILED_STATUSES
);
const impossibleMatch = "^\b$"; // this will never match anything

export {
  impossibleMatch,
  getFilterStatus,
  getMainlineCommitsQueryVariables,
  FAILED_STATUSES,
  ALL_STATUSES,
  ALL_NON_FAILING_STATUSES,
};
