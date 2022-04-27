import { PatchTasksQueryVariables } from "gql/generated/types";
import { queryString, url, array } from "utils";

const { parseQueryString, parseSortString, getString } = queryString;
const { getPageFromSearch, getLimitFromSearch } = url;
const { toArray } = array;

export const useQueryVariables = (
  search: string,
  versionId: string
): PatchTasksQueryVariables => {
  const queryParams = parseQueryString(search);
  const { sorts, variant, taskName, statuses, baseStatuses } = queryParams;
  return {
    patchId: versionId,
    variant: getString(variant),
    taskName: getString(taskName),
    statuses: toArray(statuses),
    baseStatuses: toArray(baseStatuses),
    sorts: parseSortString(sorts),
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
  };
};
