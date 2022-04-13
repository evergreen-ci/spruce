import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { useParams, useLocation } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import { TableControlOuterRow, TableControlInnerRow } from "components/styles";
import { pollInterval } from "constants/index";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  PatchTaskDurationsQuery,
  PatchTaskDurationsQueryVariables,
} from "gql/generated/types";
import { GET_PATCH_TASK_DURATIONS } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { queryString, url } from "utils";
import { TaskDurationTable } from "./taskDuration/TaskDurationTable";

const { parseQueryString, parseSortString, getString } = queryString;

const { getPageFromSearch, getLimitFromSearch } = url;
interface Props {
  taskCount: number;
}

export const TaskDuration: React.VFC<Props> = ({ taskCount }) => {
  const { id: versionId } = useParams<{ id: string }>();

  const { search } = useLocation();
  const { sendEvent } = useVersionAnalytics(versionId);
  const dispatchToast = useToastContext();

  const updateQueryParams = useUpdateURLQueryParams();
  const queryVariables = getQueryVariables(search, versionId);
  const noQueryVariables = !search.length;

  const { limit, page } = queryVariables;
  const defaultSortMethod = "STATUS:ASC;BASE_STATUS:DESC;DURATION:DESC";

  const { sorts: allSorts } = parseQueryString(search);
  const sortOrders = parseSortString(allSorts);

  useEffect(() => {
    if (noQueryVariables) {
      updateQueryParams({
        sorts: defaultSortMethod,
      });
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, startPolling, stopPolling } = useQuery<
    PatchTaskDurationsQuery,
    PatchTaskDurationsQueryVariables
  >(GET_PATCH_TASK_DURATIONS, {
    variables: queryVariables,
    skip: noQueryVariables,
    pollInterval,
    fetchPolicy: "network-only",
    onError: (err) => {
      dispatchToast.error(`Error fetching patch tasks ${err}`);
    },
  });
  usePolling(startPolling, stopPolling);
  const { patchTasks } = data || {};

  const onClearAll = () => {
    sendEvent({ name: "Clear all filter" });
    updateQueryParams({
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
      <TaskDurationTable patchTasks={patchTasks} sorts={sortOrders} />
    </>
  );
};

const getQueryVariables = (
  search: string,
  versionId: string
): PatchTaskDurationsQueryVariables => {
  const {
    [PatchTasksQueryParams.Variant]: variant,
    [PatchTasksQueryParams.TaskName]: taskName,
    [PatchTasksQueryParams.Sorts]: sorts,
  } = parseQueryString(search);

  // Only include duration when sorting on TaskDuration table.
  const filteredSorts = parseSortString(sorts).filter(
    (sort) => sort.Key === "DURATION"
  );

  return {
    patchId: versionId,
    sorts: filteredSorts,
    variant: getString(variant),
    taskName: getString(taskName),
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
