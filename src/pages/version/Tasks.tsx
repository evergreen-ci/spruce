import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Skeleton } from "antd";
import { pollInterval } from "constants/index";
import { useToastContext } from "context/toast";
import { PatchTasksQuery, PatchTasksQueryVariables } from "gql/generated/types";
import { GET_PATCH_TASKS } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { TableControl } from "./TableControl";
import { PatchTasksTable } from "./tasks/PatchTasksTable";

interface Props {
  taskCount: number;
  queryVariables: PatchTasksQueryVariables;
}

export const Tasks: React.VFC<Props> = ({ taskCount, queryVariables }) => {
  const dispatchToast = useToastContext();
  const updateQueryParams = useUpdateURLQueryParams();

  const noQueryVariables = !Object.keys(queryVariables).length;
  const { sorts, limit, page } = queryVariables;
  const defaultSortMethod = "STATUS:ASC;BASE_STATUS:DESC";

  useEffect(() => {
    updateQueryParams({
      duration: undefined,
      sorts: defaultSortMethod,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearQueryParams = () => {
    updateQueryParams({
      taskName: undefined,
      variant: undefined,
      statuses: undefined,
      baseStatuses: undefined,
      page: undefined,
      sorts: defaultSortMethod,
      duration: undefined,
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
        <PatchTasksTable sorts={sorts} patchTasks={patchTasks} />
      )}
    </>
  );
};
