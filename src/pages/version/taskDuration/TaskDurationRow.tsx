import { forwardRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Row, Cell } from "@leafygreen-ui/table";
import { Description } from "@leafygreen-ui/typography";
import { TaskLink } from "components/TasksTable/TaskLink";
import TaskStatusBadge from "components/TaskStatusBadge";
import {
  mapTaskToBarchartColor,
  mapTaskStatusToUmbrellaStatus,
} from "constants/task";
import { size } from "constants/tokens";
import { VersionTaskDurationsQuery } from "gql/generated/types";
import { TaskStatus } from "types/task";
import { Unpacked } from "types/utils";
import { string } from "utils";

const { msToDuration } = string;

interface RowProps {
  task: Unpacked<VersionTaskDurationsQuery["version"]["tasks"]["data"]>;
  maxTimeTaken: number;
  children?: React.ReactNode;
  "data-cy"?: string;
}

export const TaskDurationRow: React.FC<RowProps> = forwardRef(
  (
    { children, "data-cy": dataCy, maxTimeTaken, task, ...rest },
    ref: React.Ref<HTMLTableRowElement>
  ) => {
    const {
      buildVariantDisplayName,
      displayName,
      executionTasksFull,
      id,
      startTime,
      status,
      timeTaken,
    } = task;

    const barWidth = calculateBarWidth(timeTaken, maxTimeTaken);
    const barColor =
      mapTaskToBarchartColor[mapTaskStatusToUmbrellaStatus[status]];
    const startedWithZeroTime =
      startTime === null && status === TaskStatus.Started;

    return (
      <Row ref={ref} key={id} data-cy={dataCy} {...rest}>
        <TaskNameCell>
          <TaskLink taskId={id} taskName={displayName} />
        </TaskNameCell>
        <StatusCell>
          <TaskStatusBadge status={status} />
        </StatusCell>
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

        {/*
         * LeafyGreen at the moment fails to render nested rows that are not comprised directly of Row and Cell components.
         * To render execution tasks, reuse the same Cell structure that comprises the parent task.
         * This should be addressed by the table refactor LG-2231.
         */}
        {executionTasksFull?.map((t) => (
          <Row key={t.id} data-cy="execution-task-row">
            <TaskNameCell>
              <TaskLink taskId={t.id} taskName={t.displayName} />
            </TaskNameCell>
            <StatusCell>
              <TaskStatusBadge
                status={t.status}
                id={t.id}
                execution={t.execution}
              />
            </StatusCell>
            <BuildVariantCell>{t.buildVariantDisplayName}</BuildVariantCell>
            <DurationCell>
              {t.startTime === null && t.status === TaskStatus.Started ? (
                <DurationLabel>
                  There is no task duration information for this task at this
                  time.
                </DurationLabel>
              ) : (
                <>
                  <DurationBar
                    width={calculateBarWidth(t.timeTaken, maxTimeTaken)}
                    color={
                      mapTaskToBarchartColor[
                        mapTaskStatusToUmbrellaStatus[t.status]
                      ]
                    }
                  />
                  <DurationLabel>{msToDuration(t.timeTaken)}</DurationLabel>
                </>
              )}
            </DurationCell>
          </Row>
        ))}
      </Row>
    );
  }
);
TaskDurationRow.displayName = "Row";

const calculateBarWidth = (value: number, max: number) =>
  max ? `${(value / max) * 100}%` : "0%";

const baseCellStyle = css`
  word-break: break-all;
  vertical-align: middle;
`;

const TaskNameCell = styled(Cell)`
  ${baseCellStyle}
`;
TaskNameCell.displayName = "Cell";

const StatusCell = styled(Cell)`
  ${baseCellStyle}
`;
StatusCell.displayName = "Cell";

const BuildVariantCell = styled(Cell)`
  ${baseCellStyle}
`;
BuildVariantCell.displayName = "Cell";

const DurationCell = styled(Cell)`
  span {
    display: block;
    width: 100%;
  }
  vertical-align: middle;
`;
DurationCell.displayName = "Cell";

const barHeight = "12px";

const DurationBar = styled.div<{ width: string; color: string }>`
  width: ${({ width }) => width};
  background-color: ${({ color }) => color};
  border-radius: ${size.m};
  height: ${barHeight};
`;

const DurationLabel = styled(Description)`
  flex-shrink: 0;
  padding-top: ${size.xxs};
  font-size: ${barHeight};
`;
