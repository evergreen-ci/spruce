import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Skeleton } from "antd";
import every from "lodash.every";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import { TableControlOuterRow, TableControlInnerRow } from "components/styles";
import { pollInterval } from "constants/index";
import { getVersionRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import { PatchTasksQuery, PatchTasksQueryVariables } from "gql/generated/types";
import { GET_PATCH_TASKS } from "gql/queries";
import { useNetworkStatus } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams, TaskStatus } from "types/task";
import { queryString, url } from "utils";
import { PatchTasksTable } from "./tasks/PatchTasksTable";
import { TaskFilters } from "./tasks/TaskFilters";

const { parseQueryString, parseSortString } = queryString;

const { getPageFromSearch, getLimitFromSearch } = url;
interface Props {
  taskCount: number;
}
let nTimes = 0;

export const Tasks: React.FC<Props> = ({ taskCount }) => {
  const { id: versionId } = useParams<{ id: string }>();

  const { search } = useLocation();
  const router = useHistory();
  const patchAnalytics = usePatchAnalytics();
  const dispatchToast = useToastContext();

  const updateQueryParams = useUpdateURLQueryParams();
  const queryVariables = getQueryVariables(search, versionId);

  const { sorts, limit, page } = queryVariables;

  useEffect(() => {
    if (sorts.length === 0) {
      updateQueryParams({
        sorts: "STATUS:ASC;BASE_STATUS:DESC",
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, loading, startPolling, stopPolling } = useQuery<
    PatchTasksQuery,
    PatchTasksQueryVariables
  >(GET_PATCH_TASKS, {
    variables: queryVariables,
    pollInterval,
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      dispatchToast.error(`Error fetching patch tasks ${err}`);
    },
  });
  let showSkeleton = true;
  if (data && !loading) {
    showSkeleton = false;
  }
  useNetworkStatus(startPolling, stopPolling);
  const { patchTasks } = data || {};
  console.log(`Rendered component${nTimes}`);
  nTimes += 1;
  return (
    <>
      <TaskFilters />
      <TableControlOuterRow>
        <FlexContainer>
          <ResultCountLabel
            dataCyNumerator="current-task-count"
            dataCyDenominator="total-task-count"
            label="tasks"
            numerator={patchTasks?.count}
            denominator={taskCount}
          />
          <PaddedButton // @ts-expect-error
            onClick={() => {
              patchAnalytics.sendEvent({ name: "Clear all filter" });
              router.push(getVersionRoute(versionId));
            }}
            data-cy="clear-all-filters"
          >
            Clear All Filters
          </PaddedButton>
        </FlexContainer>
        <TableControlInnerRow>
          <Pagination
            data-cy="tasks-table-pagination"
            pageSize={limit}
            value={page}
            totalResults={patchTasks?.count}
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
      {showSkeleton ? (
        <Skeleton active title={false} paragraph={{ rows: 8 }} />
      ) : (
        <PatchTasksTable sorts={sorts} patchTasks={patchTasks} />
      )}
    </>
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
  [TaskStatus.Blocked]: true,
  [TaskStatus.Succeeded]: true,
  [TaskStatus.SystemFailed]: true,
  [TaskStatus.SystemTimedOut]: true,
  [TaskStatus.SystemUnresponsive]: true,
  [TaskStatus.TaskTimedOut]: true,
  [TaskStatus.TestTimedOut]: true,
  [TaskStatus.Undispatched]: true,
  [TaskStatus.Unstarted]: true,
  [TaskStatus.Aborted]: true,
  [TaskStatus.KnownIssue]: true,
  [TaskStatus.WillRun]: true,
  [TaskStatus.Unscheduled]: true,
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
  versionId: string
): PatchTasksQueryVariables => {
  const {
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: rawStatuses,
    [PatchTasksQueryParams.BaseStatuses]: rawBaseStatuses,
    [PatchTasksQueryParams.Sorts]: sorts,
  } = parseQueryString(search);

  return {
    patchId: versionId,
    sorts: parseSortString(sorts),
    variant: getString(variant),
    taskName: getString(taskName),
    statuses: getStatuses(rawStatuses),
    baseStatuses: getStatuses(rawBaseStatuses),
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
  };
};

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

// @ts-expect-error
const PaddedButton = styled(Button)`
  margin-left: 15px;
`;
