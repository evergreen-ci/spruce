import React from "react";
import styled from "@emotion/styled/macro";
import Badge, { Variant } from "components/Badge";
import { TaskStatus } from "types/task";
import { reportError } from "utils/errorReporting";
import { getStatusBadgeCopy } from "utils/string";

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
  aborted: boolean;
}
export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  blocked,
  aborted,
}) => {
  // We have to do this assignment because Blocked and Aborted are not official Task
  // statuses from the tasks collection but we want to represent it in the badge.
  let modifiedStatus = status;
  if (blocked) {
    modifiedStatus = TaskStatus.StatusBlocked as string;
  }
  if (aborted) {
    modifiedStatus = TaskStatus.Aborted as string;
  }

  const displayStatus = getStatusBadgeCopy(
    taskStatusToCopy[modifiedStatus] ?? modifiedStatus
  );

  if (modifiedStatus in mapTaskStatusToBadgeVariant) {
    return (
      <BadgeWidthMaxContent
        data-cy={dataCy}
        key={modifiedStatus}
        variant={mapTaskStatusToBadgeVariant[modifiedStatus]}
      >
        {displayStatus}
      </BadgeWidthMaxContent>
    );
  }

  if (modifiedStatus in mapUnsupportedBadgeColors) {
    return (
      <StyledBadge
        data-cy={dataCy}
        key={modifiedStatus}
        {...mapUnsupportedBadgeColors[modifiedStatus]}
      >
        {displayStatus}
      </StyledBadge>
    );
  }

  const err = new Error(
    `Status '${modifiedStatus}' is not a valid task status`
  );
  reportError(err).severe();
  throw err;
};

const dataCy = "task-status-badge";
