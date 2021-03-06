import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { uiColors } from "@leafygreen-ui/palette";
import { taskStatusToCopy } from "constants/task";
import { TaskStatus } from "types/task";
import { statuses, errorReporting } from "utils";

const { gray } = uiColors;
const { reportError } = errorReporting;
const { getStatusBadgeCopy } = statuses;

const mapTaskStatusToBadgeVariant = {
  [TaskStatus.Inactive]: Variant.LightGray,
  [TaskStatus.Unstarted]: Variant.LightGray,
  [TaskStatus.Undispatched]: Variant.LightGray,
  [TaskStatus.Blocked]: Variant.LightGray,
  [TaskStatus.Pending]: Variant.LightGray,
  [TaskStatus.Unscheduled]: Variant.LightGray,
  [TaskStatus.Aborted]: Variant.LightGray,
  [TaskStatus.Started]: Variant.Yellow,
  [TaskStatus.Dispatched]: Variant.Yellow,
  [TaskStatus.Failed]: Variant.Red,
  [TaskStatus.TestTimedOut]: Variant.Red,
  [TaskStatus.TaskTimedOut]: Variant.Red,
  [TaskStatus.Succeeded]: Variant.Green,
  [TaskStatus.KnownIssue]: Variant.Red,
};

const failureColors = {
  border: "#CC99CC",
  fill: "#E6CCE6",
  text: "#800080",
};

// the status colors that are not supported by the leafygreen Badge variants
const mapUnsupportedBadgeColors = {
  [TaskStatus.SystemTimedOut]: failureColors,
  [TaskStatus.SystemUnresponsive]: failureColors,
  [TaskStatus.SetupFailed]: {
    border: "#E7DBEC",
    fill: "#F3EDF5",
    text: "#877290",
  },
  [TaskStatus.WillRun]: {
    border: gray.dark2,
    fill: gray.dark1,
    text: gray.light3,
  },
  [TaskStatus.SystemFailed]: failureColors,
};

interface BadgeColorProps {
  border?: string;
  fill?: string;
  text?: string;
}

const badgeWidthMaxContent = css`
  width: max-content;
`;

// only use for statuses whose color is not supported by leafygreen badge variants, i.e. SystemFailed, TestTimedOut, SetupFailed
const StyledBadge = styled(Badge)<BadgeColorProps>`
  ${({ border }) => border && `border-color: ${border} !important;`}
  ${({ fill }) => fill && `background-color: ${fill} !important;`}
  ${({ text }) => text && `color: ${text} !important;`}
  ${badgeWidthMaxContent}
`;

interface TaskStatusBadgeProps {
  status: string;
}
const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  let displayStatus = getStatusBadgeCopy(status);

  if (taskStatusToCopy[status] === undefined) {
    const err = new Error(`Status '${status}' is not a valid task status`);
    reportError(err).warning();
  } else {
    displayStatus = getStatusBadgeCopy(taskStatusToCopy[status]);
  }

  if (status in mapTaskStatusToBadgeVariant) {
    return (
      <StyledBadge
        data-cy="task-status-badge"
        key={status}
        variant={mapTaskStatusToBadgeVariant[status]}
        css={badgeWidthMaxContent}
      >
        {displayStatus}
      </StyledBadge>
    );
  }

  if (status in mapUnsupportedBadgeColors) {
    return (
      <StyledBadge
        data-cy="task-status-badge"
        key={status}
        {...mapUnsupportedBadgeColors[status]}
      >
        {displayStatus}
      </StyledBadge>
    );
  }

  return <Badge variant={Variant.LightGray}>{status}</Badge>;
};

export default TaskStatusBadge;
