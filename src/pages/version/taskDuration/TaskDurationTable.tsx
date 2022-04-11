import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { Description } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import Icon from "components/Icon";
import { TableSearchPopover } from "components/TableSearchPopover";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { mapTaskToUmbrellaColor } from "constants/task";
import { size } from "constants/tokens";
import { PatchTasksQuery, SortOrder, SortDirection } from "gql/generated/types";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { string, queryString } from "utils";

const { msToDuration } = string;
const { updateSortString } = queryString;
const { gray, focus } = uiColors;

interface Props {
  patchTasks: PatchTasksQuery["patchTasks"];
  sorts: SortOrder[];
}

export const TaskDurationTable: React.VFC<Props> = ({ patchTasks, sorts }) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const sortDirection = sorts.length
    ? sorts.find((s) => s.Key === "DURATION").Direction
    : undefined;

  const handleSort = () => {
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
          <TableHeader
            key="task-name-duration"
            label={
              <LabelWrapper>
                Task Name
                <TableSearchPopover
                  onConfirm={(task: string) =>
                    updateQueryParams({
                      taskName: task || undefined,
                      page: "0",
                    })
                  }
                  data-cy="task-name-filter-popover"
                />
              </LabelWrapper>
            }
          />,
          <TableHeader
            key="build-variant-duration"
            label={
              <LabelWrapper>
                Build Variant
                <TableSearchPopover
                  onConfirm={(buildVariant: string) =>
                    updateQueryParams({
                      variant: buildVariant || undefined,
                      page: "0",
                    })
                  }
                  data-cy="build-variant-filter-popover"
                />
              </LabelWrapper>
            }
          />,
          <TableHeader
            key="task-duration"
            label={
              <LabelWrapper>
                Task Duration
                <SortIcon
                  glyph={
                    sortDirection === SortDirection.Asc
                      ? "SortAscending"
                      : "SortDescending"
                  }
                  fill={focus}
                  onClick={handleSort}
                  data-cy="sort-icon"
                />
              </LabelWrapper>
            }
          />,
        ]}
      >
        {({ datum }) => (
          <Row
            key={datum.id}
            data-cy="task-duration-table-row"
            expanded={false}
          >
            <Cell>
              <span>
                {datum.displayName}
                <StyledTaskStatusIcon status={datum.status} />
              </span>
            </Cell>
            <Cell>{datum.buildVariantDisplayName}</Cell>
            <Cell>
              <GraphWrapper>
                <Bar
                  width={calculateBarWidth(datum?.taskDuration, max)}
                  color={mapTaskToUmbrellaColor[datum?.status]}
                />
                <TimeLabel>{msToDuration(datum?.taskDuration)}</TimeLabel>
              </GraphWrapper>
            </Cell>

            {datum?.executionTasksFull &&
              datum?.executionTasksFull.map((task) => (
                <Row key={task.id}>
                  <Cell>
                    <span>
                      {task.displayName}
                      <StyledTaskStatusIcon status={task.status} />
                    </span>
                  </Cell>
                  <Cell>{task.buildVariantDisplayName}</Cell>
                  <Cell>
                    <GraphWrapper>
                      <Bar
                        width={calculateBarWidth(task.taskDuration, max)}
                        color={mapTaskToUmbrellaColor[task.status]}
                      />
                      <TimeLabel>{msToDuration(task.taskDuration)}</TimeLabel>
                    </GraphWrapper>
                  </Cell>
                </Row>
              ))}
          </Row>
        )}
      </Table>
      {tasks.length === 0 && (
        <NoResults>
          <Icon glyph="CurlyBraces" size="large" />
          <Message> No tasks found.</Message>
        </NoResults>
      )}
    </TableWrapper>
  );
};

export const findMax = (patchTasks: PatchTasksQuery["patchTasks"]["tasks"]) =>
  patchTasks.reduce((prev, curr) => {
    const prevTimeTaken = prev?.taskDuration;
    const currTimeTaken = curr?.taskDuration;
    return prevTimeTaken > currTimeTaken ? prev : curr;
  }).taskDuration;

export function calculateBarWidth(value: number, max: number) {
  return `${(value / max) * 100}%`;
}

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTaskStatusIcon = styled(TaskStatusIcon)`
  margin-left: ${size.xxs};
  vertical-align: text-bottom;
`;

const GraphWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimeLabel = styled(Description)`
  font-size: 12px;
  flex-shrink: 0;
  padding-top: ${size.xxs};
`;

const TableWrapper = styled.div`
  border-top: 3px solid ${gray.light2};
  th,
  td {
    word-break: break-all;
    :first-of-type {
      width: 20%;
      padding-right: ${size.l};
    }
    :nth-of-type(2) {
      width: 20%;
      padding-right: ${size.l};
    }
    :nth-of-type(3) {
      span {
        width: 100%;
      }
    }
  }
`;

const SortIcon = styled(Icon)`
  cursor: pointer;
  margin-left: ${size.xs};
`;

const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${size.l} 0;
  background-color: ${gray.light2};
  opacity: 50%;
`;

const Message = styled.div`
  margin-top: ${size.xs};
`;

interface BarProps {
  width: string;
  color: string;
}

const Bar = styled.div<BarProps>`
  width: ${({ width }) => width};
  background-color: ${({ color }) => color};
  border-radius: ${size.m};
  height: 12px;
`;
