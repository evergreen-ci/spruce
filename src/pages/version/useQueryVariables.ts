import Cookies from "js-cookie";
import { inactiveTaskQueryParam } from "components/InactiveTasksToggle";
import { INCLUDE_INACTIVE_TASKS } from "constants/cookies";
import {
  VersionTasksQueryVariables,
  SortOrder,
  TaskSortCategory,
} from "gql/generated/types";
import { PatchTasksQueryParams } from "types/task";
import { queryString, url, array } from "utils";

const { parseQueryString, parseSortString, getString } = queryString;
const { getPageFromSearch, getLimitFromSearch } = url;
const { toArray } = array;

export const useQueryVariables = (
  search: string,
  versionId: string
): VersionTasksQueryVariables => {
  const queryParams = parseQueryString(search);
  const includeInactiveTasks =
    getString(queryParams[inactiveTaskQueryParam]) !== ""
      ? getString(queryParams[inactiveTaskQueryParam]) === "true"
      : Cookies.get(INCLUDE_INACTIVE_TASKS) === "true";

  const {
    [PatchTasksQueryParams.Duration]: duration,
    [PatchTasksQueryParams.Sorts]: sorts,
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: statuses,
    [PatchTasksQueryParams.BaseStatuses]: baseStatuses,
  } = queryParams;

  // This should be reworked once the antd tables are removed.
  // At the current state, sorts & duration will never both be defined.
  let sortsToApply: SortOrder[];
  if (sorts) {
    sortsToApply = parseSortString(sorts);
  }
  if (duration) {
    sortsToApply = parseSortString(`${TaskSortCategory.Duration}:${duration}`);
  }

  return {
    versionId,
    taskFilterOptions: {
      variant: getString(variant),
      taskName: getString(taskName),
      statuses: toArray(statuses),
      baseStatuses: toArray(baseStatuses),
      sorts: sortsToApply,
      page: getPageFromSearch(search),
      limit: getLimitFromSearch(search),
      includeEmptyActivation: includeInactiveTasks,
    },
  };
};
