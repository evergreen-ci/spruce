import { forwardRef } from "react";
import styled from "@emotion/styled";
import { Row, Cell } from "@leafygreen-ui/table";
import { Description } from "@leafygreen-ui/typography";
import { TaskLink } from "components/Table/TaskLink";
import TaskStatusBadge from "components/TaskStatusBadge";
import {
  mapTaskToBarchartColor,
  mapTaskStatusToUmbrellaStatus,
} from "constants/task";
import { size } from "constants/tokens";
import { VersionTaskDurationsQuery } from "gql/generated/types";
import { TaskStatus } from "types/task";
import { string } from "utils";

const { msToDuration } = string;

interface RowProps {
  task: VersionTaskDurationsQuery["version"]["tasks"]["data"][0];
  maxTimeTaken: number;
  children?: React.ReactNode;
  "data-cy"?: string;
}

export const TaskDurationRow: React.VFC<RowProps> = forwardRef(
  (
    { task, maxTimeTaken, children, "data-cy": dataCy, ...rest },
    ref: React.Ref<HTMLTableRowElement>
  ) => {
    const {
      id,
      displayName,
      status,
      buildVariantDisplayName,
      timeTaken,
      startTime,
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
        {children}
      </Row>
    );
  }
);
TaskDurationRow.displayName = "Row";

const calculateBarWidth = (value: number, max: number) =>
  max ? `${(value / max) * 100}%` : "0%";

const TaskNameCell = styled(Cell)`
  word-break: break-all;
  padding-right: ${size.m};
`;
TaskNameCell.displayName = "Cell";

const StatusCell = styled(Cell)`
  word-break: break-all;
  padding-right: ${size.m};
`;
StatusCell.displayName = "Cell";

const BuildVariantCell = styled(Cell)`
  word-break: break-all;
  padding-right: ${size.m};
`;
BuildVariantCell.displayName = "Cell";

const DurationCell = styled(Cell)`
  span {
    display: block;
    width: 100%;
  }
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
