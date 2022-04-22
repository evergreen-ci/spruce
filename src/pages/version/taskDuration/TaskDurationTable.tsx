import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { Description } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import Icon from "components/Icon";
import { NoTableResults } from "components/Table/NoTableResults";
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
} from "gql/generated/types";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
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
  const sortDirection = sorts.length
    ? sorts.find((s) => s.Key === "DURATION").Direction
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
    const newSorts = [...sorts];
    newSorts.find((s) => s.Key === "DURATION").Direction = newSortDirection;

    updateQueryParams({
      sorts: updateSortString(newSorts),
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
              <LabelWrapper>
                Task Name
                <TableSearchPopover
                  onConfirm={handleTaskFilter}
                  data-cy="task-name-filter-popover"
                />
              </LabelWrapper>
            }
          />,
          <StyledTableHeader
            key="duration-table-build-variant"
            label={
              <LabelWrapper>
                Build Variant
                <TableSearchPopover
                  onConfirm={handleBuildVariantFilter}
                  data-cy="build-variant-filter-popover"
                />
              </LabelWrapper>
            }
          />,
          <TableHeader
            key="duration-table-task-duration"
            label={
              <LabelWrapper>
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
              </LabelWrapper>
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
                const {
                  id,
                  displayName,
                  status,
                  buildVariantDisplayName,
                  timeTaken,
                } = task;
                const barWidth = calculateBarWidth(timeTaken, max);
                const barColor =
                  mapTaskToBarchartColor[mapTaskStatusToUmbrellaStatus[status]];
                return (
                  <Row key={id}>
                    <StandardCell>
                      <TaskNameWrapper>
                        {displayName}
                        <TaskStatusIcon status={status} />
                      </TaskNameWrapper>
                    </StandardCell>
                    <StandardCell>{buildVariantDisplayName}</StandardCell>
                    <FullWidthCell>
                      <DurationWrapper>
                        <Bar width={barWidth} color={barColor} />
                        <TimeLabel>{msToDuration(timeTaken)}</TimeLabel>
                      </DurationWrapper>
                    </FullWidthCell>
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
  const { id, displayName, status, buildVariantDisplayName, timeTaken } = task;
  const barWidth = calculateBarWidth(timeTaken, max);
  const barColor =
    mapTaskToBarchartColor[mapTaskStatusToUmbrellaStatus[status]];
  return (
    <Row key={id} data-cy={dataCy}>
      <StandardCell>
        <TaskNameWrapper>
          {displayName}
          <TaskStatusIcon status={status} />
        </TaskNameWrapper>
      </StandardCell>
      <StandardCell>{buildVariantDisplayName}</StandardCell>
      <FullWidthCell>
        <DurationWrapper>
          <Bar width={barWidth} color={barColor} />
          <TimeLabel>{msToDuration(timeTaken)}</TimeLabel>
        </DurationWrapper>
      </FullWidthCell>
      {children}
    </Row>
  );
};

const findMax = (tasks: PatchTaskDurationsQuery["patchTasks"]["tasks"]) => {
  const durations = tasks.map((t) => t.timeTaken);
  return Math.max(...durations);
};

const calculateBarWidth = (value: number, max: number) =>
  max ? `${(value / max) * 100}%` : "0%";

const TableWrapper = styled.div`
  border-top: 3px solid ${gray.light2};
`;

const StandardCell = styled(Cell)`
  word-break: break-all;
  padding-right: ${size.m};
`;
StandardCell.displayName = "Cell";

const FullWidthCell = styled(Cell)`
  span {
    width: 100%;
  }
`;
FullWidthCell.displayName = "Cell";

const StyledTableHeader = styled(TableHeader)`
  width: 20%;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const DurationSortIcon = styled(Icon)`
  cursor: pointer;
  margin-left: ${size.xs};
`;

const TaskNameWrapper = styled.span`
  svg {
    margin-left: ${size.xxs};
    vertical-align: text-bottom;
  }
`;

const DurationWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Bar = styled.div<{ width: string; color: string }>`
  width: ${({ width }) => width};
  background-color: ${({ color }) => color};
  border-radius: ${size.m};
  height: 12px;
`;

const TimeLabel = styled(Description)`
  font-size: 12px;
  padding-top: ${size.xxs};
  flex-shrink: 0;
`;
