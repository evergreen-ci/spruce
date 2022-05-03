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
import { queryString } from "utils";
import { TableControl } from "./TableControl";
import { TaskDurationTable } from "./taskDuration/TaskDurationTable";
import { useQueryVariables } from "./useQueryVariables";

const { parseQueryString } = queryString;

interface Props {
  taskCount: number;
}

export const TaskDuration: React.VFC<Props> = ({ taskCount }) => {
  const dispatchToast = useToastContext();
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();

  const queryVariables = useQueryVariables(search, id);
  const noQueryVariables = !Object.keys(parseQueryString(search)).length;
  const { limit, page } = queryVariables;

  useEffect(() => {
    updateQueryParams({
      duration: "DESC",
      sorts: undefined,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearQueryParams = () => {
    updateQueryParams({
      taskName: undefined,
      variant: undefined,
      statuses: undefined,
      baseStatuses: undefined,
      page: undefined,
      sorts: undefined,
      duration: "DESC",
    });
  };

  const { data, startPolling, stopPolling } = useQuery<
    PatchTaskDurationsQuery,
    PatchTaskDurationsQueryVariables
  >(GET_PATCH_TASK_DURATIONS, {
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
      <TaskDurationTable patchTasks={patchTasks} />
    </>
  );
};
