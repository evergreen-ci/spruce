import { PatchTasksQueryVariables } from "gql/generated/types";
import { PatchTasksQueryParams } from "types/task";
import { queryString, url, array } from "utils";
import { ParseQueryString } from "utils/queryString";

const { parseQueryString, parseSortString, getString } = queryString;
const { getPageFromSearch, getLimitFromSearch } = url;
const { toArray } = array;

export const useQueryVariables = (
  search: string,
  versionId: string,
  paramsToInclude: PatchTasksQueryParams[]
): PatchTasksQueryVariables => {
  const queryParams = parseQueryString(search);
  const queryParamsToInclude: ParseQueryString = paramsToInclude.reduce(
    (acc, curr) => {
      acc[curr] = queryParams[curr];
      return acc;
    },
    {}
  );
  const {
    sorts,
    variant,
    taskName,
    statuses,
    baseStatuses,
  } = queryParamsToInclude;

  return {
    patchId: versionId,
    variant: getString(variant),
    taskName: getString(taskName),
    ...(statuses && { statuses: toArray(statuses) }),
    ...(baseStatuses && { baseStatuses: toArray(baseStatuses) }),
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
    sorts: parseSortString(sorts),
  };
};
