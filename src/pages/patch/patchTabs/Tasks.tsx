import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams, useHistory, useLocation } from "react-router-dom";
import {
  GET_PATCH_TASKS,
  PatchTasksQuery,
  PatchTasksVariables,
  PatchUrlSearchKeys,
  PatchStatus
} from "gql/queries/get-patch-tasks";
import { TasksTable } from "pages/patch/patchTabs/tasks/TasksTable";
import queryString from "query-string";
import { useDisableTableSortersIfLoading } from "hooks";
import { NetworkStatus } from "apollo-client";
import get from "lodash.get";

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
  } as PatchTasksVariables;
};

export const Tasks: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();

  const variables = getQueryVariablesFromUrlSearch(id, search);
  console.log("variables :", variables);

  const { data, loading, error, networkStatus, fetchMore } = useQuery<
    PatchTasksQuery,
    PatchTasksVariables
  >(GET_PATCH_TASKS, {
    variables: getQueryVariablesFromUrlSearch(id, search),
    notifyOnNetworkStatusChange: true
  });
  useDisableTableSortersIfLoading(networkStatus);

  useEffect(() => {
    history.listen(({ search }) => {
      if (networkStatus === NetworkStatus.ready && !error) {
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
      }
    });
  }, [history, fetchMore, id]);

  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <>
      <TasksTable
        loading={loading}
        networkStatus={networkStatus}
        data={get(data, "patchTasks", [])}
      />
    </>
  );
};
