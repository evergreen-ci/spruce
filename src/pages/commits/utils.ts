import {
  MainlineCommitsQueryVariables,
  ProjectHealthView,
} from "gql/generated/types";
import { BuildVariantDict, Commits } from "types/commits";
import { array } from "utils";
import { groupStatusesByUmbrellaStatus } from "utils/statuses";
import {
  ALL_NON_FAILING_STATUSES,
  FAILED_STATUSES,
  GROUPED_BADGES_PER_ROW,
  GROUPED_BADGE_HEIGHT,
  GROUPED_BADGE_PADDING,
  TASK_ICONS_PER_ROW,
  TASK_ICON_HEIGHT,
  TASK_ICON_PADDING,
  impossibleMatch,
} from "./constants";
import { GroupedResult } from "./types";

const { arrayIntersection } = array;

interface FilterState {
  statuses: string[];
  tasks: string[];
  variants: string[];
  requesters: string[];
  view: ProjectHealthView;
}
interface MainlineCommitOptions {
  projectIdentifier: string;
  limit: number;
  skipOrderNumber: number;
  revision: string;
}
interface CommitsPageReducerState {
  filterState: FilterState;
  mainlineCommitOptions: MainlineCommitOptions;
}

const getMainlineCommitsQueryVariables = (
  state: CommitsPageReducerState,
): MainlineCommitsQueryVariables => {
  const variables = {
    mainlineCommitsOptions: generateMainlineCommitOptionsFromState(state),
    buildVariantOptions: generateBuildVariantOptionsFromState(state),
    buildVariantOptionsForGraph:
      generateBuildVariantOptionsForGraphFromState(state),
    buildVariantOptionsForGroupedTasks:
      generateBuildVariantOptionsForGroupedTasksFromState(state),
    buildVariantOptionsForTaskIcons:
      generateBuildVariantOptionsForTaskIconsFromState(state),
  };
  return variables;
};

/**
 * `getFilterStatus` returns an object containing booleans that describe what filters have been applied.
 * @param state - the state of the commits page filters
 * @returns an object containing booleans that describe what filters have been applied
 */
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
  state: CommitsPageReducerState,
) => {
  const { filterState } = state;
  const { statuses, tasks, variants } = filterState;

  const buildVariantOptions = {
    tasks,
    variants,
    statuses,
    includeBaseTasks: false,
  };

  return buildVariantOptions;
};

const generateBuildVariantOptionsForTaskIconsFromState = (
  state: CommitsPageReducerState,
): MainlineCommitsQueryVariables["buildVariantOptions"] => {
  const { filterState } = state;
  const { hasStatuses, hasTasks } = getFilterStatus(filterState);

  let shouldShowTaskIcons = true;
  let statusesToShow = [];

  if (hasTasks || filterState.view === ProjectHealthView.All) {
    statusesToShow = filterState.statuses;
  } else if (hasStatuses) {
    const onlyHasNonFailingStatuses =
      arrayIntersection(filterState.statuses, FAILED_STATUSES).length === 0;
    if (onlyHasNonFailingStatuses) {
      shouldShowTaskIcons = false;
    } else {
      statusesToShow = arrayIntersection(filterState.statuses, FAILED_STATUSES);
    }
  } else if (filterState.view === ProjectHealthView.Failed) {
    statusesToShow = FAILED_STATUSES;
  }

  const buildVariantOptions = {
    tasks: shouldShowTaskIcons ? filterState.tasks : [impossibleMatch],
    variants: filterState.variants,
    statuses: statusesToShow,
    includeBaseTasks: false,
  };
  return buildVariantOptions;
};

const generateBuildVariantOptionsForGroupedTasksFromState = (
  state: CommitsPageReducerState,
): MainlineCommitsQueryVariables["buildVariantOptionsForGroupedTasks"] => {
  const { filterState } = state;
  const { hasFilters, hasStatuses, hasTasks } = getFilterStatus(filterState);

  // If "All" view is enabled, don't group any tasks.
  if (filterState.view === ProjectHealthView.All) {
    return {
      tasks: [impossibleMatch],
      variants: [],
      statuses: [],
    };
  }

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
        ALL_NON_FAILING_STATUSES,
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
  state: CommitsPageReducerState,
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
  state: CommitsPageReducerState,
): MainlineCommitsQueryVariables["mainlineCommitsOptions"] => {
  const { filterState, mainlineCommitOptions } = state;
  const { hasFilters } = getFilterStatus(filterState);
  return {
    ...mainlineCommitOptions,
    shouldCollapse: hasFilters,
    requesters: filterState.requesters,
  };
};

const findMaxGroupedTaskStats = (groupedTaskStats: {
  [id: string]: GroupedResult;
}) => {
  if (Object.keys(groupedTaskStats).length === 0) {
    return { max: 0 };
  }
  return Object.values(groupedTaskStats).reduce((prev, curr) =>
    prev.max > curr.max ? prev : curr,
  );
};

const getAllTaskStatsGroupedByColor = (versions: Commits) => {
  const idToGroupedTaskStats: { [id: string]: GroupedResult } = {};
  versions.forEach(({ version }) => {
    if (version != null) {
      idToGroupedTaskStats[version.id] = groupStatusesByUmbrellaStatus(
        version.taskStatusStats?.counts,
      );
    }
  });

  return idToGroupedTaskStats;
};

const constructBuildVariantDict = (versions: Commits): BuildVariantDict => {
  const buildVariantDict: BuildVariantDict = {};

  for (let i = 0; i < versions.length; i++) {
    const { version } = versions[i];

    // skip if inactive/unmatching
    if (version) {
      // Deduplicate build variants and build variant stats by consolidating into a single object.
      const allBuildVariants = [
        ...version.buildVariants,
        ...version.buildVariantStats,
      ].reduce((acc, curr) => {
        const { variant } = curr;
        acc[variant] = { ...acc[variant], ...curr };
        return acc;
      }, {});

      // Construct build variant dict which will contain information needed for rendering.
      Object.values(allBuildVariants).reduce(
        (acc, { statusCounts, tasks, variant }) => {
          // Determine height to allocate for icons.
          let iconHeight = 0;
          if (tasks) {
            const numRows = Math.ceil(tasks.length / TASK_ICONS_PER_ROW);
            const iconContainerHeight = numRows * TASK_ICON_HEIGHT;
            const iconContainerPadding = TASK_ICON_PADDING * 2;
            iconHeight = iconContainerHeight + iconContainerPadding;
          }

          // Determine height to allocate for grouped badges.
          let badgeHeight = 0;
          if (statusCounts) {
            const numRows = Math.ceil(
              statusCounts.length / GROUPED_BADGES_PER_ROW,
            );
            const badgeContainerHeight = numRows * GROUPED_BADGE_HEIGHT;
            const badgeContainerPadding = GROUPED_BADGE_PADDING * 2;
            badgeHeight = badgeContainerHeight + badgeContainerPadding;
          }

          if (acc[variant]) {
            if (iconHeight > acc[variant].iconHeight) {
              acc[variant].iconHeight = iconHeight;
            }
            if (badgeHeight > acc[variant].badgeHeight) {
              acc[variant].badgeHeight = badgeHeight;
            }
            acc[variant].priority += 1;
          } else {
            acc[variant] = { priority: 1, iconHeight, badgeHeight };
          }
          return acc;
        },
        buildVariantDict,
      );
    }
  }
  return buildVariantDict;
};

export {
  getFilterStatus,
  getMainlineCommitsQueryVariables,
  constructBuildVariantDict,
  findMaxGroupedTaskStats,
  getAllTaskStatsGroupedByColor,
};
