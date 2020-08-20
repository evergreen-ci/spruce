import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams, useLocation } from "react-router-dom";
import { GET_PATCH_TASKS } from "gql/queries/get-patch-tasks";
import {
  PatchTasksQuery,
  PatchTasksQueryVariables,
  TaskSortCategory,
  TaskResult,
  SortDirection,
} from "gql/generated/types";
import { TasksTable } from "pages/patch/patchTabs/tasks/TasksTable";
import queryString from "query-string";
import {
  useDisableTableSortersIfLoading,
  usePollQuery,
  useSetColumnDefaultSortOrder,
  useNetworkStatus,
} from "hooks";
import get from "lodash.get";
import { ErrorBoundary } from "components/ErrorBoundary";
import { TaskFilters } from "pages/patch/patchTabs/tasks/TaskFilters";
import { PatchTasksQueryParams, TaskStatus } from "types/task";
import every from "lodash.every";
import { PageSizeSelector } from "components/PageSizeSelector";
import {
  TableContainer,
  TableControlOuterRow,
  TableControlInnerRow,
  StyledRouterLink,
} from "components/styles";
import { Pagination } from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import { Skeleton } from "antd";
import { TaskStatusBadge } from "components/TaskStatusBadge";
import { ColumnProps } from "antd/lib/table";
import { getPageFromSearch, getLimitFromSearch } from "utils/url";
import { usePatchAnalytics } from "analytics";

interface Props {
  taskCount: number;
}

export const Tasks: React.FC<Props> = ({ taskCount }) => {
  const { id: resourceId } = useParams<{ id: string }>();

  const { search } = useLocation();

  const [initialQueryVariables] = useState(
    getQueryVariables(search, resourceId)
  );

  const { sortBy, sortDir } = initialQueryVariables;

  const columns = useSetColumnDefaultSortOrder<TaskResult>(
    columnsTemplate,
    sortBy,
    sortDir
  );

  const { data, error, networkStatus, refetch } = useQuery<
    PatchTasksQuery,
    PatchTasksQueryVariables
  >(GET_PATCH_TASKS, {
    variables: initialQueryVariables as PatchTasksQueryVariables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  useDisableTableSortersIfLoading(networkStatus);
  const isOffline = useNetworkStatus();
  const { showSkeleton } = usePollQuery({
    networkStatus,
    getQueryVariables,
    refetch,
    search,
    isOffline,
  });

  const patchAnalytics = usePatchAnalytics();

  if (error) {
    return <div>{error.message}</div>;
  }

  const { limit, page } = getQueryVariables(search, resourceId);

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
            sendAnalyticsEvent={() =>
              patchAnalytics.sendEvent({ name: "Change Page Size" })
            }
          />
        </TableControlInnerRow>
      </TableControlOuterRow>
      <TableContainer hide={showSkeleton}>
        <TasksTable columns={columns} data={get(data, "patchTasks", [])} />
      </TableContainer>
      {showSkeleton && (
        <Skeleton active title={false} paragraph={{ rows: 8 }} />
      )}
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
  [TaskStatus.SystemTimedOut]: true,
  [TaskStatus.SystemUnresponsive]: true,
  [TaskStatus.TaskTimedOut]: true,
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
  search: string,
  resourceId: string
): PatchTasksQueryVariables => {
  const {
    sortBy,
    sortDir,
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: rawStatuses,
    [PatchTasksQueryParams.BaseStatuses]: rawBaseStatuses,
  } = queryString.parse(search, { arrayFormat: "comma" });

  return {
    patchId: resourceId,
    sortBy: (getString(sortBy) as TaskSortCategory) ?? TaskSortCategory.Status,
    sortDir: (getString(sortDir) as SortDirection) ?? SortDirection.Asc,
    variant: getString(variant),
    taskName: getString(taskName),
    statuses: getStatuses(rawStatuses),
    baseStatuses: getStatuses(rawBaseStatuses),
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
  };
};

const renderStatusBadge = (
  status: string,
  { blocked }: TaskResult
): null | JSX.Element => {
  if (status === "" || !status) {
    return null;
  }
  return (
    <ErrorBoundary>
      <TaskStatusBadge status={status} blocked={blocked} />
    </ErrorBoundary>
  );
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
    title: "Base Status",
    dataIndex: "baseStatus",
    key: TableColumnHeader.BaseStatus,
    sorter: true,
    className: "cy-task-table-col-BASE_STATUS",
    render: renderStatusBadge,
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
    title: "Variant",
    dataIndex: "buildVariant",
    key: TableColumnHeader.Variant,
    sorter: true,
    className: "cy-task-table-col-VARIANT",
  },
];
