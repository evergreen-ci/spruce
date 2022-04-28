import { PatchTasksQueryVariables, SortOrder } from "gql/generated/types";
import { queryString, url, array } from "utils";

const { parseQueryString, parseSortString, getString } = queryString;
const { getPageFromSearch, getLimitFromSearch } = url;
const { toArray } = array;

export const useQueryVariables = (
  search: string,
  versionId: string
): PatchTasksQueryVariables => {
  const queryParams = parseQueryString(search);
  const {
    sorts,
    duration,
    variant,
    taskName,
    statuses,
    baseStatuses,
  } = queryParams;

  // This should be reworked once the antd tables are removed.
  // At the current state, sorts & duration will never both be defined.
  let sortsToApply: SortOrder[];
  if (sorts) {
    sortsToApply = parseSortString(sorts);
  }
  if (duration) {
    sortsToApply = parseSortString(`DURATION:${duration}`);
  }

  return {
    patchId: versionId,
    variant: getString(variant),
    taskName: getString(taskName),
    statuses: toArray(statuses),
    baseStatuses: toArray(baseStatuses),
    sorts: sortsToApply,
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
  };
};
