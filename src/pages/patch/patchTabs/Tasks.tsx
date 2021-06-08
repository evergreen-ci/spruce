import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Skeleton } from "antd";
import { useParams, useHistory } from "react-router-dom";
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
import { useGetTaskQueryVariables } from "hooks/useGetTaskQueryVariables";
import { useTaskSortQueryParams } from "hooks/useTaskSortQueryParams";
import { PatchTasksTable } from "pages/patch/patchTabs/tasks/PatchTasksTable";
import { TaskFilters } from "pages/patch/patchTabs/tasks/TaskFilters";

interface Props {
  taskCount: number;
}

export const Tasks: React.FC<Props> = ({ taskCount }) => {
  const { id: resourceId } = useParams<{ id: string }>();

  const router = useHistory();
  const patchAnalytics = usePatchAnalytics();
  const dispatchToast = useToastContext();

  const queryVariables = useGetTaskQueryVariables();
  const { limit, page } = queryVariables;
  const sorts = useTaskSortQueryParams();

  const { data, startPolling, stopPolling } = useQuery<
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
  if (data) {
    showSkeleton = false;
  }
  useNetworkStatus(startPolling, stopPolling);
  const { patchTasks } = data || {};

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
              router.push(getVersionRoute(resourceId));
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

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

// @ts-expect-error
const PaddedButton = styled(Button)`
  margin-left: 15px;
`;
