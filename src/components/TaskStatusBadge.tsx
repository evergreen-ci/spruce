import React from "react";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { TaskStatus } from "types/task";
import styled from "@emotion/styled/macro";
import { reportError } from "utils/errorReporting";

const mapTaskStatusToBadgeVariant = {
  [TaskStatus.Inactive]: Variant.LightGray,
  [TaskStatus.Unstarted]: Variant.LightGray,
  [TaskStatus.Undispatched]: Variant.LightGray,
  [TaskStatus.Started]: Variant.Yellow,
  [TaskStatus.Dispatched]: Variant.Yellow,
  [TaskStatus.Succeeded]: Variant.Green,
  [TaskStatus.Failed]: Variant.Red,
  [TaskStatus.TestTimedOut]: Variant.Red,
  [TaskStatus.TaskTimedOut]: Variant.Red,
  [TaskStatus.StatusBlocked]: Variant.Red,
  [TaskStatus.StatusPending]: Variant.LightGray,
};

const taskStatusToCopy = {
  [TaskStatus.Started]: "Running",
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

// only use for statuses whose color is not supported by leafygreen badge variants, i.e. SystemFailed, TestTimedOut, SetupFailed
const StyledBadge = styled(Badge)`
  border-color: ${(props: BadgeColorProps): string => props.border} !important;
  background-color: ${(props: BadgeColorProps): string => props.fill} !important
  color: ${(props: BadgeColorProps): string => props.text} !important;
`;

interface TaskStatusBadgeProps {
  status: string;
  blocked: boolean;
}
export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  blocked,
}) => {
  // We have to do this assignment because Blocked is not an official Task
  // status from the tasks collection but we want to represent it in the badge.
  const adjustedTaskStatus = blocked
    ? (TaskStatus.StatusBlocked as string)
    : status;
  if (adjustedTaskStatus in mapTaskStatusToBadgeVariant) {
    return (
      <Badge
        data-cy="task-adjustedTaskStatus-badge"
        key={adjustedTaskStatus}
        variant={mapTaskStatusToBadgeVariant[adjustedTaskStatus]}
      >
        {taskStatusToCopy[adjustedTaskStatus] ?? adjustedTaskStatus}
      </Badge>
    );
  }
  if (adjustedTaskStatus in mapUnsupportedBadgeColors) {
    return (
      <StyledBadge
        data-cy="task-adjustedTaskStatus-badge"
        key={adjustedTaskStatus}
        {...mapUnsupportedBadgeColors[adjustedTaskStatus]}
      >
        {taskStatusToCopy[adjustedTaskStatus] ?? adjustedTaskStatus}
      </StyledBadge>
    );
  }
  const err = new Error(`Status '${status}' is not a valid task status`);
  reportError(err).severe();
  throw err;
};
