import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { GET_PATCH_TASKS } from "gql/queries/get-patch-tasks";
import { PatchTasksQuery, PatchTasksQueryVariables } from "gql/generated/types";
import { TasksTable } from "pages/patch/patchTabs/tasks/TasksTable";
import queryString from "query-string";
import { useDisableTableSortersIfLoading } from "hooks";
import get from "lodash.get";
import { ErrorBoundary } from "components/ErrorBoundary";
import { TaskFilters } from "pages/patch/patchTabs/tasks/TaskFilters";
import { PatchTasksQueryParams, TaskStatus } from "types/task";
import every from "lodash/every";
import {
  PAGE_SIZES,
  DEFAULT_PAGE_SIZE,
  PageSizeSelector,
} from "components/PageSizeSelector";
import {
  TableContainer,
  TableControlOuterRow,
  TableControlInnerRow,
} from "components/styles";
import { Pagination } from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import { NetworkStatus } from "apollo-client";
import { Skeleton } from "antd";

interface Props {
  taskCount: number;
}

export const Tasks: React.FC<Props> = ({ taskCount }) => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const [initialQueryVariables] = useState({
    patchId: id,
    ...getQueryVariables(search),
  });
  const { data, error, networkStatus, fetchMore } = useQuery<
    PatchTasksQuery,
    PatchTasksQueryVariables
  >(GET_PATCH_TASKS, {
    variables: initialQueryVariables as PatchTasksQueryVariables,
    notifyOnNetworkStatusChange: true,
  });
  useDisableTableSortersIfLoading(networkStatus);

  // fetch tasks when url params change
  useEffect(
    () =>
      history.listen(async (loc) => {
        try {
          await fetchMore({
            variables: getQueryVariables(loc.search),
            updateQuery: (
              prev: PatchTasksQuery,
              { fetchMoreResult }: { fetchMoreResult: PatchTasksQuery }
            ) => {
              if (!fetchMoreResult) {
                return prev;
              }
              return fetchMoreResult;
            },
          });
        } catch (e) {
          // empty block
        }
      }),
    [history, fetchMore, id, error, networkStatus]
  );

  if (error) {
    return <div>{error.message}</div>;
  }
  const { limit, page } = getQueryVariables(search);
  const isLoading = networkStatus < NetworkStatus.ready;
  return (
    <ErrorBoundary>
      <TaskFilters />
      <TableControlOuterRow>
        <ResultCountLabel
          dataCyNumerator="current-task-count"
          dataCyDenominator="total-task-count"
          label="tasks"
          numerator={get(data, "patchTasks.count", "-")}
          denominator={taskCount}
        />
        <TableControlInnerRow>
          <Pagination
            pageSize={limit}
            value={page}
            totalResults={get(data, "patchTasks.count", 0)}
          />
          <PageSizeSelector value={limit} />
        </TableControlInnerRow>
      </TableControlOuterRow>
      <TableContainer hide={isLoading}>
        <TasksTable data={get(data, "patchTasks", [])} />
      </TableContainer>
      {isLoading && <Skeleton active title={false} paragraph={{ rows: 80 }} />}
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
  [TaskStatus.Unstarted]: true,
};

const getStatuses = (rawStatuses: string[] | string): string[] => {
  const statuses = getArray(rawStatuses).filter(
    (status) => status in statusesToIncludeInQuery
  );
  if (
    every(Object.keys(statusesToIncludeInQuery), (status) =>
      statuses.includes(status)
    )
  ) {
    // passing empty array for `All` value is also more performant for filtering on the backend as opposed to passing array of all statuses
    return [];
  }
  return statuses;
};

const getQueryVariables = (
  search: string
): {
  sortBy?: string;
  sortDir?: string;
  page?: number;
  statuses?: string[];
  baseStatuses?: string[];
  variant?: string;
  taskName?: string;
  limit?: number;
} => {
  const {
    sortBy,
    sortDir,
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: rawStatuses,
    [PatchTasksQueryParams.BaseStatuses]: rawBaseStatuses,
    [PatchTasksQueryParams.Page]: page,
    [PatchTasksQueryParams.Limit]: limit,
  } = queryString.parse(search, { arrayFormat: "comma" });

  const pageNum = parseInt(getString(page), 10);
  const limitNum = parseInt(getString(limit), 10);

  return {
    sortBy: getString(sortBy),
    sortDir: getString(sortDir),
    variant: getString(variant),
    taskName: getString(taskName),
    statuses: getStatuses(rawStatuses),
    baseStatuses: getStatuses(rawBaseStatuses),
    page: !Number.isNaN(pageNum) && pageNum >= 0 ? pageNum : 0,
    limit:
      !Number.isNaN(limitNum) && PAGE_SIZES.includes(limitNum)
        ? limitNum
        : DEFAULT_PAGE_SIZE,
  };
};
