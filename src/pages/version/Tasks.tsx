import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Skeleton } from "antd";
import { useParams, useLocation } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import { TableControlOuterRow, TableControlInnerRow } from "components/styles";
import { pollInterval } from "constants/index";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import { PatchTasksQuery, PatchTasksQueryVariables } from "gql/generated/types";
import { GET_PATCH_TASKS } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { queryString, url, array } from "utils";
import { PatchTasksTable } from "./tasks/PatchTasksTable";

const { toArray } = array;
const { parseQueryString, parseSortString, getString } = queryString;

const { getPageFromSearch, getLimitFromSearch } = url;
interface Props {
  taskCount: number;
}

export const Tasks: React.FC<Props> = ({ taskCount }) => {
  const { id: versionId } = useParams<{ id: string }>();

  const { search } = useLocation();
  const { sendEvent } = useVersionAnalytics(versionId);
  const dispatchToast = useToastContext();

  const updateQueryParams = useUpdateURLQueryParams();
  const queryVariables = getQueryVariables(search, versionId);
  const noQueryVariables = !search.length;

  const { sorts, limit, page } = queryVariables;
  const defaultSortMethod = "STATUS:ASC;BASE_STATUS:DESC";

  useEffect(() => {
    if (noQueryVariables) {
      updateQueryParams({
        sorts: defaultSortMethod,
      });
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, startPolling, stopPolling } = useQuery<
    PatchTasksQuery,
    PatchTasksQueryVariables
  >(GET_PATCH_TASKS, {
    variables: queryVariables,
    skip: noQueryVariables,
    pollInterval,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
    onError: (err) => {
      dispatchToast.error(`Error fetching patch tasks ${err}`);
    },
  });
  usePolling(startPolling, stopPolling);
  const { patchTasks } = data || {};

  const onClearAll = () => {
    sendEvent({ name: "Clear all filter" });
    updateQueryParams({
      statuses: undefined,
      baseStatuses: undefined,
      taskName: undefined,
      variant: undefined,
      page: undefined,
      sorts: defaultSortMethod,
    });
  };

  return (
    <>
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
            onClick={onClearAll}
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
            sendAnalyticsEvent={() => sendEvent({ name: "Change Page Size" })}
          />
        </TableControlInnerRow>
      </TableControlOuterRow>
      {!data ? (
        <Skeleton active title={false} paragraph={{ rows: 8 }} />
      ) : (
        <PatchTasksTable sorts={sorts} patchTasks={patchTasks} />
      )}
    </>
  );
};

const getQueryVariables = (
  search: string,
  versionId: string
): PatchTasksQueryVariables => {
  const {
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Statuses]: statuses,
    [PatchTasksQueryParams.BaseStatuses]: baseStatuses,
    [PatchTasksQueryParams.Sorts]: sorts,
  } = parseQueryString(search);

  return {
    patchId: versionId,
    sorts: parseSortString(sorts),
    variant: getString(variant),
    taskName: getString(taskName),
    statuses: toArray(statuses),
    baseStatuses: toArray(baseStatuses),
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
  margin-left: ${size.m};
`;
