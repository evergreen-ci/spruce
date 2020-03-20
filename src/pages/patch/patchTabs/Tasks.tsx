import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams, useHistory, useLocation } from "react-router-dom";
import {
  GET_PATCH_TASKS,
  PatchTasksQuery,
  PatchTasksVariables,
  PatchUrlSearchKeys
} from "gql/queries/get-patch-tasks";
import { TasksTable } from "pages/patch/patchTabs/tasks/TasksTable";
import queryString from "query-string";
import { useDisableTableSortersIfLoading } from "hooks";
import { NetworkStatus } from "apollo-client";
import get from "lodash.get";
import { P2 } from "components/Typography";

interface Props {
  taskCount: string;
}

export const Tasks: React.FC<Props> = ({ taskCount }) => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const { data, loading, error, networkStatus, fetchMore } = useQuery<
    PatchTasksQuery,
    PatchTasksVariables
  >(GET_PATCH_TASKS, {
    variables: getQueryVariablesFromUrlSearch(id, search),
    notifyOnNetworkStatusChange: true
  });
  useDisableTableSortersIfLoading(networkStatus);

  const fetchMoreTasks = (search: string) => {
    fetchMore({
      variables: getQueryVariablesFromUrlSearch(id, search),
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
  };

  // fetch tasks when url params change
  useEffect(
    () =>
      history.listen(({ search }) => {
        if (networkStatus === NetworkStatus.ready && !error) {
          fetchMoreTasks(search);
        }
      }),
    [history, fetchMore, id, error, networkStatus]
  );

  if (error) {
    return <div>{error.message}</div>;
  }

  const count = get(data, "patchTasks.length", "-");
  const total = taskCount || "-";
  return (
    <>
      <P2 id="task-count">{`${count} / ${total} tasks`}</P2>
      <TasksTable
        loading={loading}
        networkStatus={networkStatus}
        data={get(data, "patchTasks", [])}
      />
    </>
  );
};

const getQueryVariablesFromUrlSearch = (
  patchId: string,
  search: string
): PatchTasksVariables => {
  // TODO: add 'statuses' var here when the UI is implemented
  const { sortBy, sortDir, page } = queryString.parse(
    search
  ) as PatchUrlSearchKeys;
  return {
    patchId,
    sortBy,
    sortDir,
    page
  };
};
