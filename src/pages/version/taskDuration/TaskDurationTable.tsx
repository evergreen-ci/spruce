import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Table, TableHeader } from "@leafygreen-ui/table";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { NoTableResults } from "components/Table/NoTableResults";
import { TableFilterPopover } from "components/TableFilterPopover";
import { TableSearchPopover } from "components/TableSearchPopover";
import { PatchTaskDurationsQuery } from "gql/generated/types";
import { useTaskStatuses, useStatusesFilter } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PatchTasksQueryParams } from "types/task";
import { DisplayTaskRow, ExecutionTaskRow } from "./Row";

const { gray } = uiColors;

interface Props {
  patchTasks: PatchTaskDurationsQuery["patchTasks"];
}

export const TaskDurationTable: React.VFC<Props> = ({ patchTasks }) => {
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

  const handleTaskFilter = (task: string) => {
    updateQueryParams({
      taskName: task || undefined,
      page: "0",
    });
  };

  const handleBuildVariantFilter = (buildVariant: string) => {
    updateQueryParams({
      variant: buildVariant || undefined,
      page: "0",
    });
  };

  const handleDurationSort = (direction: string) => {
    updateQueryParams({
      duration: direction.toUpperCase(),
      page: "0",
    });
  };

  const { tasks } = patchTasks ?? {};
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
                  onConfirm={handleTaskFilter}
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
                  onConfirm={handleBuildVariantFilter}
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
          <DisplayTaskRow
            task={datum}
            maxTimeTaken={maxTimeTaken}
            data-cy="task-duration-table-row"
          >
            {datum?.executionTasksFull &&
              datum?.executionTasksFull.map((task) => (
                <ExecutionTaskRow
                  key={task.id}
                  task={task}
                  maxTimeTaken={maxTimeTaken}
                />
              ))}
          </DisplayTaskRow>
        )}
      </Table>
      {tasks.length === 0 && <NoTableResults message="No tasks found." />}
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
