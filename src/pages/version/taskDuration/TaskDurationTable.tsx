import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { Description } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import Icon from "components/Icon";
import { NoTableResults } from "components/Table/NoTableResults";
import { TaskLink } from "components/Table/TaskLink";
import { TableSearchPopover } from "components/TableSearchPopover";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import {
  mapTaskToBarchartColor,
  mapTaskStatusToUmbrellaStatus,
} from "constants/task";
import { size } from "constants/tokens";
import {
  PatchTaskDurationsQuery,
  SortOrder,
  SortDirection,
  TaskSortCategory,
} from "gql/generated/types";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { TaskStatus } from "types/task";
import { string, queryString } from "utils";

const { msToDuration } = string;
const { updateSortString } = queryString;
const { gray, focus } = uiColors;

interface Props {
  patchTasks: PatchTaskDurationsQuery["patchTasks"];
  sorts: SortOrder[];
}

export const TaskDurationTable: React.VFC<Props> = ({ patchTasks, sorts }) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const durationKey = TaskSortCategory.Duration;
  const sortDirection = sorts.length
    ? sorts.find((s) => s.Key === durationKey)?.Direction
    : undefined;

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

  const handleDurationSort = () => {
    const newSortDirection =
      sortDirection === SortDirection.Asc
        ? SortDirection.Desc
        : SortDirection.Asc;
    const newSort = [
      {
        Key: durationKey,
        Direction: newSortDirection,
      },
    ];
    updateQueryParams({
      sorts: updateSortString(newSort),
      page: "0",
    });
  };

  const { tasks } = patchTasks ?? {};
  const max = tasks && tasks.length ? findMax(tasks) : 0;

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
            label={
              <TableHeaderLabel>
                Task Duration
                <DurationSortIcon
                  glyph={
                    sortDirection === SortDirection.Asc
                      ? "SortAscending"
                      : "SortDescending"
                  }
                  fill={focus}
                  onClick={handleDurationSort}
                  data-cy="duration-sort-icon"
                />
              </TableHeaderLabel>
            }
          />,
        ]}
      >
        {({ datum }) => (
          <DisplayTaskRow
            task={datum}
            max={max}
            data-cy="task-duration-table-row"
          >
            {datum?.executionTasksFull &&
              datum?.executionTasksFull.map((task) => {
                const barWidth = calculateBarWidth(task.timeTaken, max);
                const barColor =
                  mapTaskToBarchartColor[
                    mapTaskStatusToUmbrellaStatus[task.status]
                  ];
                return (
                  <Row key={task.id}>
                    <TaskNameCell>
                      <TaskLink taskId={task.id} taskName={task.displayName} />
                      <TaskStatusIcon status={task.status} />
                    </TaskNameCell>
                    <BuildVariantCell>
                      {task.buildVariantDisplayName}
                    </BuildVariantCell>
                    <DurationCell>
                      <DurationBar width={barWidth} color={barColor} />
                      <DurationLabel>
                        {msToDuration(task.timeTaken)}
                      </DurationLabel>
                    </DurationCell>
                  </Row>
                );
              })}
          </DisplayTaskRow>
        )}
      </Table>
      {tasks.length === 0 && <NoTableResults message="No tasks found." />}
    </TableWrapper>
  );
};

interface RowProps {
  task: PatchTaskDurationsQuery["patchTasks"]["tasks"][0];
  max: number;
  "data-cy"?: string;
  children?: React.ReactNode;
}

const DisplayTaskRow: React.VFC<RowProps> = ({
  task,
  max,
  children,
  "data-cy": dataCy,
}) => {
  const {
    id,
    displayName,
    status,
    buildVariantDisplayName,
    timeTaken,
    startTime,
  } = task;

  const barWidth = calculateBarWidth(timeTaken, max);
  const barColor =
    mapTaskToBarchartColor[mapTaskStatusToUmbrellaStatus[status]];

  const startedWithZeroTime =
    startTime === null && status === TaskStatus.Started;

  return (
    <Row key={id} data-cy={dataCy}>
      <TaskNameCell>
        <TaskLink taskId={id} taskName={displayName} />
        <TaskStatusIcon status={status} />
      </TaskNameCell>
      <BuildVariantCell>{buildVariantDisplayName}</BuildVariantCell>
      <DurationCell>
        {startedWithZeroTime ? (
          <DurationLabel>
            There is no task duration information for this task at this time.
          </DurationLabel>
        ) : (
          <>
            <DurationBar width={barWidth} color={barColor} />
            <DurationLabel>{msToDuration(timeTaken)}</DurationLabel>
          </>
        )}
      </DurationCell>
      {children}
    </Row>
  );
};

const findMax = (tasks: PatchTaskDurationsQuery["patchTasks"]["tasks"]) => {
  const durations = tasks.map((t) => (t.startTime !== null ? t.timeTaken : 0));
  return Math.max(...durations);
};

const calculateBarWidth = (value: number, max: number) =>
  max ? `${(value / max) * 100}%` : "0%";

const TableWrapper = styled.div`
  border-top: 3px solid ${gray.light2};
`;

const StyledTableHeader = styled(TableHeader)`
  width: 20%;
`;

const TableHeaderLabel = styled.div`
  display: flex;
  align-items: center;
`;

const TaskNameCell = styled(Cell)`
  word-break: break-all;
  padding-right: ${size.m};
  svg {
    margin-left: ${size.xxs};
    vertical-align: text-bottom;
  }
`;
TaskNameCell.displayName = "Cell";

const BuildVariantCell = styled(Cell)`
  word-break: break-all;
  padding-right: ${size.m};
`;
BuildVariantCell.displayName = "Cell";

const DurationCell = styled(Cell)`
  span {
    width: 100%;
  }
`;
DurationCell.displayName = "Cell";

const DurationBar = styled.div<{ width: string; color: string }>`
  width: ${({ width }) => width};
  background-color: ${({ color }) => color};
  border-radius: ${size.m};
  height: 12px;
`;

const DurationLabel = styled(Description)`
  font-size: 12px;
  padding-top: ${size.xxs};
  flex-shrink: 0;
`;

const DurationSortIcon = styled(Icon)`
  cursor: pointer;
  margin-left: ${size.xs};
`;
