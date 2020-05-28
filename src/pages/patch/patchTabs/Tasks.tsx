import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { GET_PATCH_TASKS } from "gql/queries/get-patch-tasks";
import {
  PatchTasksQuery,
  PatchTasksQueryVariables,
  TaskResult,
  SortDirection,
} from "gql/generated/types";
import { TasksTable } from "pages/patch/patchTabs/tasks/TasksTable";
import queryString from "query-string";
import {
  useDisableTableSortersIfLoading,
  useSetColumnDefaultSortOrder,
} from "hooks";
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
  StyledRouterLink,
} from "components/styles";
import { Pagination } from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import { Skeleton } from "antd";
import { isNetworkRequestInFlight } from "apollo-client/core/networkStatus";
import { TaskStatusBadge } from "components/TaskStatusBadge";
import { ColumnProps } from "antd/lib/table";

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
  const { sortBy, sortDir } = initialQueryVariables;
  const columns = useSetColumnDefaultSortOrder<TaskResult>(
    columnsTemplate,
    sortBy,
    sortDir
  );
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
  const isLoading = isNetworkRequestInFlight(networkStatus);
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
            dataTestId="tasks-table-pagination"
            pageSize={limit}
            value={page}
            totalResults={get(data, "patchTasks.count", 0)}
          />
          <PageSizeSelector
            dataTestId="tasks-table-page-size-selector"
            value={limit}
          />
        </TableControlInnerRow>
      </TableControlOuterRow>
      <TableContainer hide={isLoading}>
        <TasksTable columns={columns} data={get(data, "patchTasks", [])} />
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

enum TableColumnHeader {
  Name = "NAME",
  Status = "STATUS",
  BaseStatus = "BASE_STATUS",
  Variant = "VARIANT",
}

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
    sortBy: getString(sortBy) ?? TableColumnHeader.Status,
    sortDir: getString(sortDir) ?? SortDirection.Asc,
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

const renderStatusBadge = (status): null | JSX.Element => {
  if (status === "" || !status) {
    return null;
  }
  return <TaskStatusBadge status={status} />;
};

const columnsTemplate: Array<ColumnProps<TaskResult>> = [
  {
    title: "Name",
    dataIndex: "displayName",
    key: TableColumnHeader.Name,
    sorter: true,
    width: "40%",
    className: "cy-task-table-col-NAME",
    render: (name: string, { id }: TaskResult): JSX.Element => (
      <StyledRouterLink to={`/task/${id}`}>{name}</StyledRouterLink>
    ),
  },
  {
    title: "Patch Status",
    dataIndex: "status",
    key: TableColumnHeader.Status,
    sorter: true,
    className: "cy-task-table-col-STATUS",
    render: renderStatusBadge,
  },
  {
    title: "Base Status",
    dataIndex: "baseStatus",
    key: TableColumnHeader.BaseStatus,
    sorter: true,
    className: "cy-task-table-col-BASE_STATUS",
    render: renderStatusBadge,
  },
  {
    title: "Variant",
    dataIndex: "buildVariant",
    key: TableColumnHeader.Variant,
    sorter: true,
    className: "cy-task-table-col-VARIANT",
  },
];
