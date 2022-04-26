import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useParams, useLocation } from "react-router-dom";
import { pollInterval } from "constants/index";
import { durationQueryParams } from "constants/patch";
import { useToastContext } from "context/toast";
import {
  PatchTaskDurationsQuery,
  PatchTaskDurationsQueryVariables,
} from "gql/generated/types";
import { GET_PATCH_TASK_DURATIONS } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { TableControl } from "./TableControl";
import { TaskDurationTable } from "./taskDuration/TaskDurationTable";
import { useQueryVariables } from "./useQueryVariables";

interface Props {
  taskCount: number;
}

export const TaskDuration: React.VFC<Props> = ({ taskCount }) => {
  const { id: versionId } = useParams<{ id: string }>();

  const { search } = useLocation();
  const dispatchToast = useToastContext();

  const updateQueryParams = useUpdateURLQueryParams();
  const noQueryVariables = !search.length;
  const queryVariables = useQueryVariables(
    search,
    versionId,
    durationQueryParams
  );
  const { sorts, limit, page } = queryVariables;
  const defaultSortMethod = "DURATION:DESC";

  useEffect(() => {
    updateQueryParams({
      sorts: defaultSortMethod,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      <TableControl
        filteredCount={patchTasks?.count}
        taskCount={taskCount}
        limit={limit}
        page={page}
        defaultSortMethod={defaultSortMethod}
      />
      <TaskDurationTable patchTasks={patchTasks} sorts={sorts} />
    </>
  );
};
