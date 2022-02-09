import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { purple } from "constants/colors";
import { taskStatusToCopy } from "constants/task";
import { TaskStatus } from "types/task";
import { statuses, errorReporting } from "utils";

const { reportError } = errorReporting;
const { getStatusBadgeCopy } = statuses;

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

  return (
    <StyledBadge
      data-cy="task-status-badge"
      key={status}
      {...customBadgeColors(status)}
    >
      {displayStatus}
    </StyledBadge>
  );
};

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
  [TaskStatus.WillRun]: Variant.DarkGray,
};
const customBadgeColors = (status: string) => {
  switch (status) {
    case TaskStatus.SetupFailed:
      return {
        fill: purple.light1,
        border: purple.light2,
        text: purple.base,
      };
    case TaskStatus.SystemFailed:
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
      return {
        fill: purple.base,
        border: purple.dark1,
        text: purple.light1,
      };

    default:
      return {};
  }
};

export default TaskStatusBadge;
