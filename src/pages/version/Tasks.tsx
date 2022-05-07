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
import { queryString } from "utils";
import { TableControl } from "./TableControl";
import { PatchTasksTable } from "./tasks/PatchTasksTable";
import { useQueryVariables } from "./useQueryVariables";

const { parseQueryString } = queryString;
const defaultSortMethod = "STATUS:ASC;BASE_STATUS:DESC";

interface Props {
  taskCount: number;
}

export const Tasks: React.VFC<Props> = ({ taskCount }) => {
  const dispatchToast = useToastContext();
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();

  const queryVariables = useQueryVariables(search, id);
  const noQueryVariables = !Object.keys(parseQueryString(search)).length;
  const { sorts, limit, page } = queryVariables;

  useEffect(() => {
    updateQueryParams({
      [PatchTasksQueryParams.Duration]: undefined,
      [PatchTasksQueryParams.Sorts]: defaultSortMethod,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearQueryParams = () => {
    updateQueryParams({
      [PatchTasksQueryParams.TaskName]: undefined,
      [PatchTasksQueryParams.Variant]: undefined,
      [PatchTasksQueryParams.Statuses]: undefined,
      [PatchTasksQueryParams.BaseStatuses]: undefined,
      [PatchTasksQueryParams.Page]: undefined,
      [PatchTasksQueryParams.Duration]: undefined,
      [PatchTasksQueryParams.Sorts]: defaultSortMethod,
    });
  };

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
  const { tasks } = patchTasks || {};

  return (
    <>
      <TableControl
        filteredCount={patchTasks?.count}
        taskCount={taskCount}
        limit={limit}
        page={page}
        clearQueryParams={clearQueryParams}
      />
      {!data ? (
        <Skeleton active title={false} paragraph={{ rows: 8 }} />
      ) : (
        <PatchTasksTable sorts={sorts} tasks={tasks} />
      )}
    </>
  );
};
