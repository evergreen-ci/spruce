import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams, useHistory, useLocation } from "react-router-dom";
import {
  GET_PATCH_TASKS,
  PatchTasksQuery,
  PatchTasksVariables
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
  const { data, error, networkStatus, fetchMore } = useQuery<
    PatchTasksQuery,
    PatchTasksVariables
  >(GET_PATCH_TASKS, {
    variables: getQueryVariablesFromUrlSearch(
      id,
      search
    ) as PatchTasksVariables,
    notifyOnNetworkStatusChange: true
  });
  useDisableTableSortersIfLoading(networkStatus);

  // fetch tasks when url params change
  useEffect(() => {
    return history.listen(async location => {
      if (networkStatus === NetworkStatus.ready && !error) {
        try {
          await fetchMore({
            variables: getQueryVariablesFromUrlSearch(id, location.search),
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

  if (error) {
    return <div>{error.message}</div>;
  }
  const count = get(data, "patchTasks.length", "-");
  const total = taskCount || "-";
  return (
    <>
      <P2 id="task-count">{`${count} / ${total} tasks`}</P2>
      <TasksTable
        networkStatus={networkStatus}
        data={get(data, "patchTasks", [])}
      />
    </>
  );
};

const getString = (param: string | string[]): string =>
  Array.isArray(param) ? param[0] : param;

const getQueryVariablesFromUrlSearch = (patchId: string, search: string) => {
  // TODO: add 'statuses' var here when the UI is implemented
  const { sortBy, sortDir } = queryString.parse(search);
  return {
    patchId,
    sortBy: getString(sortBy),
    sortDir: getString(sortDir)
  };
};
