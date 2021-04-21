import React from "react";
import styled from "@emotion/styled/macro";
import Badge, { Variant } from "components/Badge";
import { TaskStatus } from "types/task";
import { reportError } from "utils/errorReporting";
import { getStatusBadgeCopy } from "utils/statuses";

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
  [TaskStatus.StatusBlocked]: Variant.LightGray,
  [TaskStatus.StatusPending]: Variant.LightGray,
  [TaskStatus.Aborted]: Variant.Red,
  [TaskStatus.Known]: Variant.Blue,
};

const taskStatusToCopy = {
  [TaskStatus.Started]: "Running",
  [TaskStatus.Inactive]: "Inactive",
  [TaskStatus.Unstarted]: "Unstarted",
  [TaskStatus.Undispatched]: "Undispatched",
  [TaskStatus.Dispatched]: "Dispatched",
  [TaskStatus.Succeeded]: "Success",
  [TaskStatus.Failed]: "Failed",
  [TaskStatus.TestTimedOut]: "Test-timed-out",
  [TaskStatus.TaskTimedOut]: "Task-timed-out",
  [TaskStatus.StatusBlocked]: "Blocked",
  [TaskStatus.StatusPending]: "Pending",
  [TaskStatus.Aborted]: "Aborted",
  [TaskStatus.Known]: "Known Failure",
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
  width: max-content;
`;

const BadgeWidthMaxContent = styled(Badge)`
  width: max-content;
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

  const displayStatus = getStatusBadgeCopy(
    taskStatusToCopy[adjustedTaskStatus] ?? adjustedTaskStatus
  );

  if (adjustedTaskStatus in mapTaskStatusToBadgeVariant) {
    return (
      <BadgeWidthMaxContent
        data-cy={dataCy}
        key={adjustedTaskStatus}
        variant={mapTaskStatusToBadgeVariant[adjustedTaskStatus]}
      >
        {displayStatus}
      </BadgeWidthMaxContent>
    );
  }

  if (adjustedTaskStatus in mapUnsupportedBadgeColors) {
    return (
      <StyledBadge
        data-cy={dataCy}
        key={adjustedTaskStatus}
        {...mapUnsupportedBadgeColors[adjustedTaskStatus]}
      >
        {displayStatus}
      </StyledBadge>
    );
  }
  const err = new Error(`Status '${status} is not a valid task status`);
  reportError(err).warning();
  return (
    <BadgeWidthMaxContent variant={Variant.LightGray}>
      {status}
    </BadgeWidthMaxContent>
  );
};

const dataCy = "task-status-badge";
