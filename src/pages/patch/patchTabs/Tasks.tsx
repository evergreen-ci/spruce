import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Skeleton } from "antd";
import { ColumnProps } from "antd/lib/table";
import every from "lodash.every";
import get from "lodash.get";
import queryString from "query-string";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { ErrorBoundary } from "components/ErrorBoundary";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import {
  TableContainer,
  TableControlOuterRow,
  TableControlInnerRow,
  StyledRouterLink,
} from "components/styles";
import { TaskStatusBadge } from "components/TaskStatusBadge";
import { WordBreak } from "components/Typography";
import { pollInterval } from "constants/index";
import { getVersionRoute } from "constants/routes";
import {
  PatchTasksQuery,
  PatchTasksQueryVariables,
  TaskResult,
  SortDirection,
  TaskSortCategory,
} from "gql/generated/types";
import { GET_PATCH_TASKS } from "gql/queries";
import { useNetworkStatus } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { TaskFilters } from "pages/patch/patchTabs/tasks/TaskFilters";
import { TasksTable } from "pages/patch/patchTabs/tasks/TasksTable";
import { PatchTasksQueryParams, TaskStatus } from "types/task";
import { getPageFromSearch, getLimitFromSearch } from "utils/url";
import { parseSortString } from "./Util";

interface Props {
  taskCount: number;
}

export const Tasks: React.FC<Props> = ({ taskCount }) => {
  const { id: resourceId } = useParams<{ id: string }>();

  const { search } = useLocation();
  const router = useHistory();
  const updateQueryParams = useUpdateURLQueryParams();

  const queryVariables = getQueryVariables(search, resourceId);

  const { sorts, limit, page } = queryVariables;

  if (sorts.length === 0) {
    updateQueryParams({
      sorts: "STATUS,ASC;BASE_STATUS,ASC",
    });
  }

  const { data, error, startPolling, stopPolling } = useQuery<
    PatchTasksQuery,
    PatchTasksQueryVariables
  >(GET_PATCH_TASKS, {
    variables: queryVariables,
    pollInterval,
    fetchPolicy: "cache-and-network",
  });
  let showSkeleton = true;
  if (data) {
    showSkeleton = false;
  }
  useNetworkStatus(startPolling, stopPolling);

  const columnsTemplate: Array<ColumnProps<TaskResult>> = [
    {
      title: "Name",
      dataIndex: "displayName",
      key: TaskSortCategory.Name,
      sorter: {
        multiple: 4,
      },
      width: "40%",
      className: "cy-task-table-col-NAME",
      render: (name: string, { id }: TaskResult): JSX.Element => (
        <TaskLink taskName={name} taskId={id} />
      ),
    },
    {
      title: "Patch Status",
      dataIndex: "status",
      key: TaskSortCategory.Status,
      sorter: {
        multiple: 4,
      },
      className: "cy-task-table-col-STATUS",
      render: renderStatusBadge,
    },
    {
      title: "Base Status",
      dataIndex: "baseStatus",
      key: TaskSortCategory.BaseStatus,
      sorter: {
        multiple: 4,
      },
      className: "cy-task-table-col-BASE_STATUS",
      render: renderStatusBadge,
    },
    {
      title: "Variant",
      dataIndex: "buildVariant",
      key: TaskSortCategory.Variant,
      sorter: {
        multiple: 4,
      },
      className: "cy-task-table-col-VARIANT",
    },
  ];
  if (sorts.length === 0) {
    // works around a quirk/bug in the antd table where default sorts don't
    // get updated on subsequent renders
    columnsTemplate[1].defaultSortOrder = "ascend";
    columnsTemplate[2].defaultSortOrder = "ascend";
  } else {
    sorts.forEach((sort) => {
      const direction =
        sort.Direction === SortDirection.Desc ? "descend" : "ascend";
      switch (sort.Key) {
        case TaskSortCategory.Name: {
          columnsTemplate[0].defaultSortOrder = direction;
          break;
        }
        case TaskSortCategory.Status: {
          columnsTemplate[1].defaultSortOrder = direction;
          break;
        }
        case TaskSortCategory.BaseStatus: {
          columnsTemplate[2].defaultSortOrder = direction;
          break;
        }
        case TaskSortCategory.Variant: {
          columnsTemplate[3].defaultSortOrder = direction;
          break;
        }
        default:
          break;
      }
    });
  }

  const patchAnalytics = usePatchAnalytics();

  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <ErrorBoundary>
      <TaskFilters />
      <TableControlOuterRow>
        <FlexContainer>
          <ResultCountLabel
            dataCyNumerator="current-task-count"
            dataCyDenominator="total-task-count"
            label="tasks"
            numerator={get(data, "patchTasks.count", "-")}
            denominator={taskCount}
          />
          <PaddedButton
            onClick={() => {
              patchAnalytics.sendEvent({ name: "Clear all filter" });
              router.push(getVersionRoute(resourceId));
            }}
          >
            Clear All Filters
          </PaddedButton>
        </FlexContainer>
        <TableControlInnerRow>
          <Pagination
            dataTestId="tasks-table-pagination"
            pageSize={limit}
            value={page}
            totalResults={get(data, "patchTasks.count", 0)}
          />
          <PageSizeSelector
            data-cy="tasks-table-page-size-selector"
            value={limit}
            sendAnalyticsEvent={() =>
              patchAnalytics.sendEvent({ name: "Change Page Size" })
            }
          />
        </TableControlInnerRow>
      </TableControlOuterRow>
      <TableContainer hide={showSkeleton}>
        <TasksTable
          columns={columnsTemplate}
          data={get(data, "patchTasks", [])}
        />
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

const getQueryVariables = (
  search: string,
  resourceId: string
): PatchTasksQueryVariables => {
  const {
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: rawStatuses,
    [PatchTasksQueryParams.BaseStatuses]: rawBaseStatuses,
    [PatchTasksQueryParams.Sorts]: sorts,
  } = queryString.parse(search, { arrayFormat: "comma" });

  return {
    patchId: resourceId,
    sorts: parseSortString(sorts),
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

interface TaskLinkProps {
  taskId: string;
  taskName: string;
}
const TaskLink: React.FC<TaskLinkProps> = ({ taskId, taskName }) => {
  const patchAnalytics = usePatchAnalytics();
  const onClick = () =>
    patchAnalytics.sendEvent({ name: "Click Task Table Link", taskId });
  return (
    <StyledRouterLink onClick={onClick} to={`/task/${taskId}`}>
      <WordBreak>{taskName}</WordBreak>
    </StyledRouterLink>
  );
};

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PaddedButton = styled(Button)`
  margin-left: 15px;
`;
