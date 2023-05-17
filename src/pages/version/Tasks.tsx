import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams, useLocation } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import TableControl from "components/Table/TableControl";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  VersionTasksQuery,
  VersionTasksQueryVariables,
} from "gql/generated/types";
import { GET_VERSION_TASKS } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { queryString } from "utils";
import { PatchTasksTable } from "./tasks/PatchTasksTable";
import { useQueryVariables } from "./useQueryVariables";

const { parseQueryString } = queryString;
const defaultSortMethod = "STATUS:ASC;BASE_STATUS:DESC";

interface Props {
  taskCount: number;
}

export const Tasks: React.VFC<Props> = ({ taskCount }) => {
  const dispatchToast = useToastContext();
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const versionAnalytics = useVersionAnalytics(id);
  const queryVariables = useQueryVariables(search, id);
  const hasQueryVariables = Object.keys(parseQueryString(search)).length > 0;
  const { sorts, limit, page } = queryVariables.taskFilterOptions;

  useEffect(() => {
    updateQueryParams({
      [PatchTasksQueryParams.Duration]: undefined,
      [PatchTasksQueryParams.Sorts]: defaultSortMethod,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearQueryParams = () => {
    updateQueryParams({
      [PatchTasksQueryParams.TaskName]: undefined,
      [PatchTasksQueryParams.Variant]: undefined,
      [PatchTasksQueryParams.Statuses]: undefined,
      [PatchTasksQueryParams.BaseStatuses]: undefined,
      [PatchTasksQueryParams.Page]: undefined,
      [PatchTasksQueryParams.Duration]: undefined,
      [PatchTasksQueryParams.Sorts]: defaultSortMethod,
    });
    versionAnalytics.sendEvent({
      name: "Clear all filter",
    });
  };

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    VersionTasksQuery,
    VersionTasksQueryVariables
  >(GET_VERSION_TASKS, {
    variables: queryVariables,
    pollInterval: DEFAULT_POLL_INTERVAL,
    skip: !hasQueryVariables,
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      dispatchToast.error(`Error fetching patch tasks ${err}`);
    },
  });
  usePolling({ startPolling, stopPolling, refetch });
  const { version } = data || {};
  const { tasks, isPatch } = version || {};
  const { data: tasksData = [], count = 0 } = tasks || {};

  const shouldShowBottomTableControl = tasksData.length > 10;

  const tableControls = (
    <TableControl
      filteredCount={count}
      totalCount={taskCount}
      limit={limit}
      page={page}
      label="tasks"
      onClear={clearQueryParams}
      onPageSizeChange={() => {
        versionAnalytics.sendEvent({
          name: "Change Page Size",
        });
      }}
    />
  );
  return (
    <>
      {tableControls}
      <PatchTasksTable
        isPatch={isPatch}
        sorts={sorts}
        tasks={tasksData}
        loading={tasksData.length === 0 && loading}
      />
      {shouldShowBottomTableControl && (
        <TableControlWrapper>{tableControls}</TableControlWrapper>
      )}
    </>
  );
};

const TableControlWrapper = styled.div`
  padding-top: ${size.xs};
  margin-bottom: ${size.l};
`;
