import { useEffect } from "react";
import every from "lodash.every";
import { useParams, useLocation } from "react-router-dom";
import { PatchTasksQueryVariables } from "gql/generated/types";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { parseSortString } from "pages/patch/patchTabs/util";
import { PatchTasksQueryParams, TaskStatus } from "types/task";
import { queryString, url } from "utils";

const { parseQueryString } = queryString;
const { getPageFromSearch, getLimitFromSearch } = url;

export const useTaskSortQueryParams = () => {
  const { id: resourceId } = useParams<{ id: string }>();

  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const queryVariables = getQueryVariables(search, resourceId);

  const { sorts } = queryVariables;

  useEffect(() => {
    if (sorts.length === 0) {
      updateQueryParams({
        sorts: "STATUS:ASC;BASE_STATUS:DESC",
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return sorts;
};

const getString = (param: string | string[]): string =>
  Array.isArray(param) ? param[0] : param;
const getArray = (param: string | string[]): string[] =>
  Array.isArray(param) ? param : [param];

const statusesToIncludeInQuery = {
  [TaskStatus.Dispatched]: true,
  [TaskStatus.Failed]: true,
  [TaskStatus.Inactive]: true,
  [TaskStatus.SetupFailed]: true,
  [TaskStatus.Started]: true,
  [TaskStatus.StatusBlocked]: true,
  [TaskStatus.Succeeded]: true,
  [TaskStatus.SystemFailed]: true,
  [TaskStatus.SystemTimedOut]: true,
  [TaskStatus.SystemUnresponsive]: true,
  [TaskStatus.TaskTimedOut]: true,
  [TaskStatus.TestTimedOut]: true,
  [TaskStatus.Undispatched]: true,
  [TaskStatus.Unstarted]: true,
  [TaskStatus.Aborted]: true,
};

const getStatuses = (rawStatuses: string[] | string): string[] => {
  const statuses = getArray(rawStatuses).filter(
    (status) => status in statusesToIncludeInQuery
  );
  if (
    every(Object.keys(statusesToIncludeInQuery), (status) =>
      statuses.includes(status)
    )
  ) {
    // passing empty array for `All` value is also more performant for filtering on the backend as opposed to passing array of all statuses
    return [];
  }
  return statuses;
};

const getQueryVariables = (
  search: string,
  resourceId: string
): PatchTasksQueryVariables => {
  const {
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: rawStatuses,
    [PatchTasksQueryParams.BaseStatuses]: rawBaseStatuses,
    [PatchTasksQueryParams.Sorts]: sorts,
  } = parseQueryString(search);

  return {
    patchId: resourceId,
    sorts: parseSortString(sorts),
    variant: getString(variant),
    taskName: getString(taskName),
    statuses: getStatuses(rawStatuses),
    baseStatuses: getStatuses(rawBaseStatuses),
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
  };
};
