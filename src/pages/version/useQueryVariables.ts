import {
  VersionTasksQueryVariables,
  SortOrder,
  TaskSortCategory,
} from "gql/generated/types";
import { PatchTasksQueryParams } from "types/task";
import { queryString, url, array } from "utils";

const { getString, parseQueryString, parseSortString } = queryString;
const { getLimitFromSearch, getPageFromSearch } = url;
const { toArray } = array;

export const useQueryVariables = (
  search: string,
  versionId: string,
): VersionTasksQueryVariables => {
  const queryParams = parseQueryString(search);
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
    },
  };
};
