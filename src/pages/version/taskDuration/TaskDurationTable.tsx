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
          <StyledTableHeader
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
          <StyledTableHeader
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
                <DurationSortIcon
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
              <TaskNameWrapper>
                {datum.displayName}
                <TaskStatusIcon status={datum.status} />
              </TaskNameWrapper>
            </Cell>
            <Cell>{datum.buildVariantDisplayName}</Cell>
            <Cell>
              <DurationWrapper>
                <Bar
                  width={calculateBarWidth(datum.timeTaken, max)}
                  color={
                    mapTaskToBarchartColor[
                      mapTaskStatusToUmbrellaStatus[datum.status]
                    ]
                  }
                />
                <TimeLabel>{msToDuration(datum.timeTaken)}</TimeLabel>
              </DurationWrapper>
            </Cell>

            {datum?.executionTasksFull &&
              datum?.executionTasksFull.map((task) => (
                <Row key={task.id}>
                  <Cell>
                    <TaskNameWrapper>
                      {task.displayName}
                      <TaskStatusIcon status={task.status} />
                    </TaskNameWrapper>
                  </Cell>
                  <Cell>{task.buildVariantDisplayName}</Cell>
                  <Cell>
                    <DurationWrapper>
                      <Bar
                        width={calculateBarWidth(task.timeTaken, max)}
                        color={
                          mapTaskToBarchartColor[
                            mapTaskStatusToUmbrellaStatus[datum.status]
                          ]
                        }
                      />
                      <TimeLabel>{msToDuration(task.timeTaken)}</TimeLabel>
                    </DurationWrapper>
                  </Cell>
                </Row>
              ))}
          </Row>
        )}
      </Table>
      {tasks.length === 0 && <NoTableResults message="No tasks found." />}
    </TableWrapper>
  );
};

export const findMax = (
  tasks: PatchTaskDurationsQuery["patchTasks"]["tasks"]
) => {
  const durations = tasks.map((t) => t.timeTaken);
  return Math.max(...durations);
};

export function calculateBarWidth(value: number, max: number) {
  return `${(value / max) * 100}%`;
}

const TableWrapper = styled.div`
  border-top: 3px solid ${gray.light2};

  // Styling the Cell directly doesn't work, so styling is done through the table.
  td {
    word-break: break-all;
    padding-right: ${size.m};
    :nth-of-type(3) {
      span {
        width: 100%;
    }
  }
`;

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
