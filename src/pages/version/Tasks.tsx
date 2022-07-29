import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useParams, useLocation } from "react-router-dom";
import { pollInterval } from "constants/index";
import { useToastContext } from "context/toast";
import {
  VersionTasksQuery,
  VersionTasksQueryVariables,
} from "gql/generated/types";
import { GET_VERSION_TASKS } from "gql/queries";
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
  const hasQueryVariables = Object.keys(parseQueryString(search)).length > 0;
  const { sorts, limit, page } = queryVariables.taskFilterOptions;

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

  const {
    data: versionData,
    loading,
    refetch,
    startPolling,
    stopPolling,
  } = useQuery<VersionTasksQuery, VersionTasksQueryVariables>(
    GET_VERSION_TASKS,
    {
      variables: queryVariables,
      pollInterval,
      skip: !hasQueryVariables,
      fetchPolicy: "cache-and-network",
      onError: (err) => {
        dispatchToast.error(`Error fetching patch tasks ${err}`);
      },
    }
  );
  usePolling(startPolling, stopPolling, refetch);
  const { version } = versionData || {};
  const { tasks } = version || {};
  const { data = [], count = 0 } = tasks || {};

  return (
    <>
      <TableControl
        filteredCount={count}
        taskCount={taskCount}
        limit={limit}
        page={page}
        onClear={clearQueryParams}
      />
      <PatchTasksTable
        sorts={sorts}
        tasks={data}
        loading={data.length === 0 && loading}
      />
    </>
  );
};
