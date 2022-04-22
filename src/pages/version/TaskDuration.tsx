import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useParams, useLocation } from "react-router-dom";
import { pollInterval } from "constants/index";
import { useToastContext } from "context/toast";
import {
  PatchTaskDurationsQuery,
  PatchTaskDurationsQueryVariables,
} from "gql/generated/types";
import { GET_PATCH_TASK_DURATIONS } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { queryString, url } from "utils";
import { TabTableControl } from "./TabTableControl";
import { TaskDurationTable } from "./taskDuration/TaskDurationTable";

const { parseQueryString, parseSortString, getString } = queryString;

const { getPageFromSearch, getLimitFromSearch } = url;
interface Props {
  taskCount: number;
}

export const TaskDuration: React.VFC<Props> = ({ taskCount }) => {
  const { id: versionId } = useParams<{ id: string }>();

  const { search } = useLocation();
  const dispatchToast = useToastContext();

  const updateQueryParams = useUpdateURLQueryParams();
  const queryVariables = getQueryVariables(search, versionId);
  const noQueryVariables = !search.length;

  const { limit, page } = queryVariables;

  const { sorts } = parseQueryString(search);
  const allSorts = parseSortString(sorts);
  const defaultSortMethod = "STATUS:ASC;BASE_STATUS:DESC;DURATION:DESC";

  useEffect(() => {
    if (noQueryVariables) {
      updateQueryParams({
        sorts: defaultSortMethod,
      });
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, startPolling, stopPolling } = useQuery<
    PatchTaskDurationsQuery,
    PatchTaskDurationsQueryVariables
  >(GET_PATCH_TASK_DURATIONS, {
    variables: queryVariables,
    skip: noQueryVariables,
    pollInterval,
    fetchPolicy: "network-only",
    onError: (err) => {
      dispatchToast.error(`Error fetching patch tasks ${err}`);
    },
  });
  usePolling(startPolling, stopPolling);
  const { patchTasks } = data || {};

  return (
    <>
      <TabTableControl
        filteredCount={patchTasks?.count}
        taskCount={taskCount}
        limit={limit}
        page={page}
        defaultSortMethod={defaultSortMethod}
      />
      <TaskDurationTable patchTasks={patchTasks} sorts={allSorts} />
    </>
  );
};

const getQueryVariables = (
  search: string,
  versionId: string
): PatchTaskDurationsQueryVariables => {
  const {
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Sorts]: sorts,
  } = parseQueryString(search);

  // Only include duration when sorting on TaskDuration table.
  const filteredSorts = parseSortString(sorts).filter(
    (sort) => sort.Key === "DURATION"
  );

  return {
    patchId: versionId,
    sorts: filteredSorts,
    variant: getString(variant),
    taskName: getString(taskName),
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
  };
};
