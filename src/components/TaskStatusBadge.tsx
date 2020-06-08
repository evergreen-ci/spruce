import React from "react";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { TaskStatus } from "types/task";
import styled from "@emotion/styled/macro";

const mapTaskStatusToBadgeVariant = {
  [TaskStatus.Inactive]: Variant.LightGray,
  [TaskStatus.Unstarted]: Variant.LightGray,
  [TaskStatus.Undispatched]: Variant.LightGray,
  [TaskStatus.Started]: Variant.Yellow,
  [TaskStatus.Dispatched]: Variant.Yellow,
  [TaskStatus.Succeeded]: Variant.Green,
  [TaskStatus.Failed]: Variant.Red,
  [TaskStatus.TestTimedOut]: Variant.Red,
  [TaskStatus.StatusBlocked]: Variant.DarkGray,
  [TaskStatus.StatusPending]: Variant.LightGray,
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

export const TaskStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status in mapTaskStatusToBadgeVariant) {
    return (
      <Badge key={status} variant={mapTaskStatusToBadgeVariant[status]}>
        {status}
      </Badge>
    );
  }
  if (status in mapUnsupportedBadgeColors) {
    return (
      <StyledBadge key={status} {...mapUnsupportedBadgeColors[status]}>
        {status}
      </StyledBadge>
    );
  }
  throw new Error(`Status '${status}' is not a valid task status`);
};
