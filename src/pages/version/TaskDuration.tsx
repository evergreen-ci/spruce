import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { pollInterval } from "constants/index";
import { useToastContext } from "context/toast";
import {
  PatchTaskDurationsQuery,
  PatchTaskDurationsQueryVariables,
  PatchTasksQueryVariables,
} from "gql/generated/types";
import { GET_PATCH_TASK_DURATIONS } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { TableControl } from "./TableControl";
import { TaskDurationTable } from "./taskDuration/TaskDurationTable";

interface Props {
  taskCount: number;
  queryVariables: PatchTasksQueryVariables;
}

export const TaskDuration: React.VFC<Props> = ({
  taskCount,
  queryVariables,
}) => {
  const dispatchToast = useToastContext();
  const updateQueryParams = useUpdateURLQueryParams();

  const noQueryVariables = !Object.keys(queryVariables).length;
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
