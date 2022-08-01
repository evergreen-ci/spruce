import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useParams, useLocation } from "react-router-dom";
import { pollInterval } from "constants/index";
import { useToastContext } from "context/toast";
import {
  VersionTaskDurationsQuery,
  VersionTaskDurationsQueryVariables,
} from "gql/generated/types";
import { GET_VERSION_TASK_DURATIONS } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { queryString } from "utils";
import { TableControl } from "./TableControl";
import { TaskDurationTable } from "./taskDuration/TaskDurationTable";
import { useQueryVariables } from "./useQueryVariables";

const { parseQueryString } = queryString;

interface Props {
  taskCount: number;
}

const TaskDuration: React.VFC<Props> = ({ taskCount }) => {
  const dispatchToast = useToastContext();
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();

  const queryVariables = useQueryVariables(search, id);
  const hasQueryVariables = Object.keys(parseQueryString(search)).length > 0;
  const { limit, page } = queryVariables.taskFilterOptions;

  useEffect(() => {
    updateQueryParams({
      [PatchTasksQueryParams.Duration]: "DESC",
      [PatchTasksQueryParams.Sorts]: undefined,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearQueryParams = () => {
    updateQueryParams({
      [PatchTasksQueryParams.TaskName]: undefined,
      [PatchTasksQueryParams.Variant]: undefined,
      [PatchTasksQueryParams.Statuses]: undefined,
      [PatchTasksQueryParams.BaseStatuses]: undefined,
      [PatchTasksQueryParams.Page]: undefined,
      [PatchTasksQueryParams.Duration]: "DESC",
      [PatchTasksQueryParams.Sorts]: undefined,
    });
  };

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    VersionTaskDurationsQuery,
    VersionTaskDurationsQueryVariables
  >(GET_VERSION_TASK_DURATIONS, {
    variables: queryVariables,
    skip: !hasQueryVariables,
    pollInterval,
    onError: (err) => {
      dispatchToast.error(`Error fetching patch tasks ${err}`);
    },
  });
  usePolling(startPolling, stopPolling, refetch);
  const { version } = data || {};
  const { tasks } = version || {};
  const { data: tasksData = [], count = 0 } = tasks || {};

  return (
    <>
      <TableControl
        filteredCount={count}
        taskCount={taskCount}
        limit={limit}
        page={page}
        onClear={clearQueryParams}
      />
      <TaskDurationTable tasks={tasksData} loading={loading} />
    </>
  );
};

export default TaskDuration;
