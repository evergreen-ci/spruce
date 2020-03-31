import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams, useHistory, useLocation } from "react-router-dom";
import {
  GET_PATCH_TASKS,
  PATCH_TASKS_LIMIT,
  PatchTasksQuery,
  PatchTasksVariables
} from "gql/queries/get-patch-tasks";
import { TasksTable } from "pages/patch/patchTabs/tasks/TasksTable";
import queryString from "query-string";
import { useDisableTableSortersIfLoading } from "hooks";
import { NetworkStatus } from "apollo-client";
import get from "lodash.get";
import { P2 } from "components/Typography";
import { ErrorBoundary } from "components/ErrorBoundary";
import { TaskFilters } from "pages/patch/patchTabs/tasks/TaskFilters";
import { PatchTasksQueryParams, TaskStatus } from "types/task";
import every from "lodash/every";

interface Props {
  taskCount: string;
}

export const Tasks: React.FC<Props> = ({ taskCount }) => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const { data, error, networkStatus, fetchMore } = useQuery<
    PatchTasksQuery,
    PatchTasksVariables
  >(GET_PATCH_TASKS, {
    variables: getQueryVariables(id, search, 0) as PatchTasksVariables,
    notifyOnNetworkStatusChange: true
  });
  useDisableTableSortersIfLoading(networkStatus);

  // fetch tasks when url params change
  useEffect(() => {
    return history.listen(async location => {
      if (networkStatus === NetworkStatus.ready && !error && fetchMore) {
        try {
          await fetchMore({
            variables: getQueryVariables(id, location.search, 0),
            updateQuery: (
              prev: PatchTasksQuery,
              { fetchMoreResult }: { fetchMoreResult: PatchTasksQuery }
            ) => {
              if (!fetchMoreResult) {
                return prev;
              }
              return fetchMoreResult;
            }
          });
        } catch (e) {
          // empty block
        }
      }
    });
  }, [history, fetchMore, id, error, networkStatus]);

  const [allItemsHaveBeenFetched, setAllItemsHaveBeenFetched] = React.useState(
    false
  );

  // fetch new sorted tasks after a table header is clicked
  const onFetch = (): void => {
    if (
      allItemsHaveBeenFetched ||
      networkStatus === NetworkStatus.error ||
      error ||
      !data
    ) {
      return;
    }
    const pageNum = data.patchTasks.length / PATCH_TASKS_LIMIT;
    if (pageNum % 1 !== 0) {
      setAllItemsHaveBeenFetched(true);
      return;
    }
    fetchMore({
      variables: getQueryVariables(id, search, pageNum),
      updateQuery: (
        prev: PatchTasksQuery,
        { fetchMoreResult }: { fetchMoreResult: PatchTasksQuery }
      ) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return {
          ...prev,
          patchTasks: [...prev.patchTasks, ...fetchMoreResult.patchTasks]
        };
      }
    });
  };

  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <ErrorBoundary>
      <TaskFilters />
      <P2 id="task-count">
        <span data-cy="current-task-count">
          {get(data, "patchTasks.length", "-")}
        </span>
        {"/"}
        <span data-cy="total-task-count">{taskCount || "-"}</span>
        <span>{" tasks"}</span>
      </P2>
      <TasksTable
        networkStatus={networkStatus}
        data={get(data, "patchTasks", [])}
        onFetch={onFetch}
      />
    </ErrorBoundary>
  );
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
  [TaskStatus.TestTimedOut]: true,
  [TaskStatus.Undispatched]: true,
  [TaskStatus.Unstarted]: true
};

const getStatuses = (rawStatuses: string[] | string) => {
  const statuses = getArray(rawStatuses).filter(
    status => status in statusesToIncludeInQuery
  );
  if (
    every(Object.keys(statusesToIncludeInQuery), status =>
      statuses.includes(status)
    )
  ) {
    return [];
  }
  return statuses;
};

const getQueryVariables = (patchId: string, search: string, page: number) => {
  const {
    sortBy,
    sortDir,
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: rawStatuses,
    [PatchTasksQueryParams.BaseStatuses]: rawBaseStatuses
  } = queryString.parse(search, { arrayFormat: "comma" });

  return {
    patchId,
    sortBy: getString(sortBy),
    sortDir: getString(sortDir),
    variant: getString(variant),
    taskName: getString(taskName),
    statuses: getStatuses(rawStatuses),
    baseStatuses: getStatuses(rawBaseStatuses),
    page
  };
};
