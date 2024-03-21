import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams, useLocation } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import TableControl from "components/Table/TableControl";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { slugs } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  VersionTaskDurationsQuery,
  VersionTaskDurationsQueryVariables,
} from "gql/generated/types";
import { VERSION_TASK_DURATIONS } from "gql/queries";
import { usePolling } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { queryString } from "utils";
import { TaskDurationTable } from "./taskDuration/TaskDurationTable";
import { useQueryVariables } from "./useQueryVariables";

const { parseQueryString } = queryString;

interface Props {
  taskCount: number;
}

const TaskDuration: React.FC<Props> = ({ taskCount }) => {
  const dispatchToast = useToastContext();
  const { [slugs.versionId]: versionId } = useParams();
  const { search } = useLocation();

  const updateQueryParams = useUpdateURLQueryParams();
  const versionAnalytics = useVersionAnalytics(versionId);
  const queryVariables = useQueryVariables(search, versionId);
  const hasQueryVariables = Object.keys(parseQueryString(search)).length > 0;
  const { limit, page } = queryVariables.taskFilterOptions;

  useEffect(() => {
    updateQueryParams({
      [PatchTasksQueryParams.Duration]: "DESC",
      [PatchTasksQueryParams.Sorts]: undefined,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearQueryParams = () => {
    updateQueryParams({
      [PatchTasksQueryParams.TaskName]: undefined,
      [PatchTasksQueryParams.Variant]: undefined,
      [PatchTasksQueryParams.Statuses]: undefined,
      [PatchTasksQueryParams.BaseStatuses]: undefined,
      [PatchTasksQueryParams.Page]: undefined,
      [PatchTasksQueryParams.Duration]: "DESC",
      [PatchTasksQueryParams.Sorts]: undefined,
    });
  };

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    VersionTaskDurationsQuery,
    VersionTaskDurationsQueryVariables
  >(VERSION_TASK_DURATIONS, {
    variables: queryVariables,
    skip: !hasQueryVariables,
    pollInterval: DEFAULT_POLL_INTERVAL,
    onError: (err) => {
      dispatchToast.error(`Error fetching patch tasks ${err}`);
    },
  });
  usePolling({ startPolling, stopPolling, refetch });
  const { version } = data || {};
  const { tasks } = version || {};
  const { count = 0, data: tasksData = [] } = tasks || {};
  const shouldShowBottomTableControl = tasksData.length > 10;

  return (
    <>
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
      <TaskDurationTable
        tasks={tasksData}
        loading={loading}
        numLoadingRows={limit}
      />
      {shouldShowBottomTableControl && (
        <TableControlWrapper>
          <TableControl
            filteredCount={count}
            totalCount={taskCount}
            limit={limit}
            label="tasks"
            page={page}
            onClear={clearQueryParams}
            onPageSizeChange={() => {
              versionAnalytics.sendEvent({
                name: "Change Page Size",
              });
            }}
          />
        </TableControlWrapper>
      )}
    </>
  );
};
const TableControlWrapper = styled.div`
  padding-top: ${size.xs};
  margin-bottom: ${size.l};
`;

export default TaskDuration;
