import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Table, TableHeader } from "@leafygreen-ui/table";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import {
  TableFilterPopover,
  TableSearchPopover,
} from "components/TablePopover";
import { PatchTaskDurationsQuery } from "gql/generated/types";
import {
  useTaskStatuses,
  useStatusesFilter,
  useFilterInputChangeHandler,
} from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { TaskDurationRow } from "./TaskDurationRow";

const { gray } = uiColors;

interface Props {
  tasks: PatchTaskDurationsQuery["patchTasks"]["tasks"];
  loading: boolean;
}

export const TaskDurationTable: React.VFC<Props> = ({ tasks, loading }) => {
  const { id: versionId } = useParams<{ id: string }>();
  const { sendEvent } = useVersionAnalytics(versionId);
  const updateQueryParams = useUpdateURLQueryParams();

  const { currentStatuses } = useTaskStatuses({ versionId });

  const filterProps = {
    resetPage: true,
    sendAnalyticsEvent: (filterBy: string) =>
      sendEvent({ name: "Filter Tasks", filterBy }),
  };

  const statusesFilter = useStatusesFilter({
    urlParam: PatchTasksQueryParams.Statuses,
    ...filterProps,
  });

  const taskFilter = useFilterInputChangeHandler({
    urlParam: PatchTasksQueryParams.TaskName,
    ...filterProps,
  });

  const variantFilter = useFilterInputChangeHandler({
    urlParam: PatchTasksQueryParams.Variant,
    ...filterProps,
  });

  const handleDurationSort = (direction: string) => {
    updateQueryParams({
      duration: direction.toUpperCase(),
      page: "0",
    });
  };

  const maxTimeTaken = findMaxTimeTaken(tasks);

  return !tasks ? (
    <Skeleton active title={false} paragraph={{ rows: 8 }} />
  ) : (
    <TableWrapper>
      <Table
        data={tasks}
        columns={[
          <StyledTableHeader
            key="duration-table-task-name"
            label={
              <TableHeaderLabel>
                Task Name
                <TableSearchPopover
                  value={taskFilter.inputValue}
                  onChange={taskFilter.setInputValue}
                  onConfirm={taskFilter.submitInputValue}
                  data-cy="task-name-filter-popover"
                />
              </TableHeaderLabel>
            }
          />,
          <StyledTableHeader
            key="duration-table-status"
            label={
              <TableHeaderLabel>
                Status
                <TableFilterPopover
                  value={statusesFilter.inputValue}
                  options={currentStatuses}
                  onConfirm={statusesFilter.setAndSubmitInputValue}
                  data-cy="status-filter-popover"
                />
              </TableHeaderLabel>
            }
          />,
          <StyledTableHeader
            key="duration-table-build-variant"
            label={
              <TableHeaderLabel>
                Build Variant
                <TableSearchPopover
                  value={variantFilter.inputValue}
                  onChange={variantFilter.setInputValue}
                  onConfirm={variantFilter.submitInputValue}
                  data-cy="build-variant-filter-popover"
                />
              </TableHeaderLabel>
            }
          />,
          <TableHeader
            key="duration-table-task-duration"
            label={<TableHeaderLabel>Task Duration</TableHeaderLabel>}
            handleSort={handleDurationSort}
          />,
        ]}
      >
        {({ datum }) => (
          <TaskDurationRow
            data-cy="task-duration-table-row"
            task={datum}
            maxTimeTaken={maxTimeTaken}
          >
            {datum?.executionTasksFull &&
              datum?.executionTasksFull.map((task) => (
                <TaskDurationRow
                  key={`execution_task_${task.id}`}
                  task={task}
                  maxTimeTaken={maxTimeTaken}
                />
              ))}
          </TaskDurationRow>
        )}
      </Table>
      {loading && (
        <TablePlaceholder glyph="Refresh" message="Loading..." spin />
      )}
      {!loading && tasks.length === 0 && (
        <TablePlaceholder message="No tasks found." />
      )}
    </TableWrapper>
  );
};

const findMaxTimeTaken = (
  tasks: PatchTaskDurationsQuery["patchTasks"]["tasks"]
) => {
  if (tasks && tasks.length) {
    const durations = tasks.map((t) =>
      t.startTime !== null ? t.timeTaken : 0
    );
    return Math.max(...durations);
  }
  return 0;
};

const TableWrapper = styled.div`
  border-top: 3px solid ${gray.light2};
`;

const StyledTableHeader = styled(TableHeader)`
  width: 15%;
`;

const TableHeaderLabel = styled.div`
  display: flex;
  align-items: center;
`;
