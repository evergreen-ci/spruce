import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { TaskStatus } from "types/task";
import { statuses, errorReporting } from "utils";

const { reportError } = errorReporting;
const { getStatusBadgeCopy } = statuses;

const mapTaskStatusToBadgeVariant = {
  [TaskStatus.Inactive]: Variant.LightGray,
  [TaskStatus.Unstarted]: Variant.LightGray,
  [TaskStatus.Undispatched]: Variant.LightGray,
  [TaskStatus.TaskWillRun]: Variant.LightGray,
  [TaskStatus.StatusBlocked]: Variant.LightGray,
  [TaskStatus.StatusPending]: Variant.LightGray,
  [TaskStatus.TaskWillNotRun]: Variant.DarkGray,
  [TaskStatus.Aborted]: Variant.LightGray,
  [TaskStatus.Started]: Variant.Yellow,
  [TaskStatus.Dispatched]: Variant.Yellow,
  [TaskStatus.Failed]: Variant.Red,
  [TaskStatus.TestTimedOut]: Variant.Red,
  [TaskStatus.TaskTimedOut]: Variant.Red,
  [TaskStatus.Succeeded]: Variant.Green,
  [TaskStatus.Known]: Variant.Blue,
};

const taskStatusToCopy = {
  [TaskStatus.Started]: "Running",
  [TaskStatus.Inactive]: "Inactive",
  [TaskStatus.Unstarted]: "Unstarted",
  [TaskStatus.Undispatched]: "Undispatched",
  [TaskStatus.TaskWillRun]: "Will Run",
  [TaskStatus.TaskWillNotRun]: "Will Not Run",
  [TaskStatus.Dispatched]: "Dispatched",
  [TaskStatus.Succeeded]: "Success",
  [TaskStatus.Failed]: "Failed",
  [TaskStatus.TestTimedOut]: "Test-timed-out",
  [TaskStatus.TaskTimedOut]: "Task-timed-out",
  [TaskStatus.StatusBlocked]: "Blocked",
  [TaskStatus.StatusPending]: "Pending",
  [TaskStatus.Aborted]: "Aborted",
  [TaskStatus.Known]: "Known Failure",
  [TaskStatus.SystemFailed]: "System Failed",
  [TaskStatus.SystemTimedOut]: "System Time Out",
  [TaskStatus.SystemUnresponsive]: "System Unresponsive",
  [TaskStatus.SetupFailed]: "Setup Failure",
};

const failureColors = {
  text: "#800080",
  border: "#CC99CC",
  fill: "#E6CCE6",
};

// the status colors that are not supported by the leafygreen Badge variants
const mapUnsupportedBadgeColors = {
  [TaskStatus.SystemFailed]: failureColors,
  [TaskStatus.SystemTimedOut]: failureColors,
  [TaskStatus.SystemUnresponsive]: failureColors,
  [TaskStatus.SetupFailed]: {
    border: "#E7DBEC",
    fill: "#F3EDF5",
    text: "#877290",
  },
};

interface BadgeColorProps {
  border: string;
  fill: string;
  text: string;
}

const badgeWidthMaxContent = css`
  width: max-content;
`;

// only use for statuses whose color is not supported by leafygreen badge variants, i.e. SystemFailed, TestTimedOut, SetupFailed
const StyledBadge = styled(Badge)`
  border-color: ${(props: BadgeColorProps): string => props.border} !important;
  background-color: ${(props: BadgeColorProps): string =>
    props.fill} !important;
  color: ${(props: BadgeColorProps): string => props.text} !important;
  ${badgeWidthMaxContent}
`;

interface TaskStatusBadgeProps {
  status: string;
}
const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  console.log({ status });
  console.log(taskStatusToCopy[status]);
  const displayStatus = getStatusBadgeCopy(taskStatusToCopy[status]);

  if (status in mapTaskStatusToBadgeVariant) {
    return (
      <Badge
        data-cy="task-status-badge"
        key={status}
        variant={mapTaskStatusToBadgeVariant[status]}
      >
        {displayStatus}
      </Badge>
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

  const err = new Error(`Status '${status} is not a valid task status`);
  reportError(err).warning();
  return <Badge variant={Variant.LightGray}>{status}</Badge>;
};

export default TaskStatusBadge;
