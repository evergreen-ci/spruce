import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Skeleton } from "antd";
import { useParams, useLocation } from "react-router-dom";
import { pollInterval } from "constants/index";
import { useToastContext } from "context/toast";
import { PatchTasksQuery, PatchTasksQueryVariables } from "gql/generated/types";
import { GET_PATCH_TASKS } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { queryString, url, array } from "utils";
import { TabTableControl } from "./TabTableControl";
import { PatchTasksTable } from "./tasks/PatchTasksTable";

const { toArray } = array;
const { parseQueryString, parseSortString, getString } = queryString;

const { getPageFromSearch, getLimitFromSearch } = url;
interface Props {
  taskCount: number;
}

export const Tasks: React.VFC<Props> = ({ taskCount }) => {
  const { id: versionId } = useParams<{ id: string }>();

  const { search } = useLocation();
  const dispatchToast = useToastContext();

  const updateQueryParams = useUpdateURLQueryParams();
  const queryVariables = getQueryVariables(search, versionId);
  const noQueryVariables = !search.length;

  const { sorts, limit, page } = queryVariables;
  const defaultSortMethod = "STATUS:ASC;BASE_STATUS:DESC;DURATION:DESC";

  useEffect(() => {
    if (noQueryVariables) {
      updateQueryParams({
        sorts: defaultSortMethod,
      });
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, startPolling, stopPolling } = useQuery<
    PatchTasksQuery,
    PatchTasksQueryVariables
  >(GET_PATCH_TASKS, {
    variables: queryVariables,
    skip: noQueryVariables,
    pollInterval,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
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
      {!data ? (
        <Skeleton active title={false} paragraph={{ rows: 8 }} />
      ) : (
        <PatchTasksTable sorts={sorts} patchTasks={patchTasks} />
      )}
    </>
  );
};

const getQueryVariables = (
  search: string,
  versionId: string
): PatchTasksQueryVariables => {
  const {
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: statuses,
    [PatchTasksQueryParams.BaseStatuses]: baseStatuses,
    [PatchTasksQueryParams.Sorts]: sorts,
  } = parseQueryString(search);

  // Don't include duration when sorting on PatchTasks table.
  const filteredSorts = parseSortString(sorts).filter(
    (sort) => sort.Key !== "DURATION"
  );

  return {
    patchId: versionId,
    sorts: filteredSorts,
    variant: getString(variant),
    taskName: getString(taskName),
    statuses: toArray(statuses),
    baseStatuses: toArray(baseStatuses),
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
  };
};
