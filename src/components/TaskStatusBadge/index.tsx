import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { getTaskRoute } from "constants/routes";
import { taskStatusToCopy } from "constants/task";
import { TaskStatus, TaskTab } from "types/task";
import { statuses } from "utils";
import { reportError } from "utils/errorReporting";

const { purple } = palette;
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
  id?: string;
  execution?: number;
}
const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  execution,
  id,
  status,
}) => {
  if (!status) {
    return null;
  }

  let displayStatus = getStatusBadgeCopy(status);

  if (taskStatusToCopy[status] === undefined) {
    const err = new Error(`Status '${status}' is not a valid task status`);
    reportError(err).warning();
  } else {
    displayStatus = getStatusBadgeCopy(taskStatusToCopy[status]);
  }

  if (status in mapTaskStatusToBadgeVariant) {
    return (
      <ConditionalWrapper
        condition={!!id}
        wrapper={(children) => (
          <Link
            to={getTaskRoute(id, {
              execution,
              tab:
                status === TaskStatus.KnownIssue
                  ? TaskTab.Annotations
                  : undefined,
            })}
          >
            {children}
          </Link>
        )}
      >
        <StyledBadge
          data-cy="task-status-badge"
          key={status}
          variant={mapTaskStatusToBadgeVariant[status]}
          css={badgeWidthMaxContent}
        >
          {displayStatus}
        </StyledBadge>
      </ConditionalWrapper>
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
        fill: purple.light2,
        border: purple.base,
        text: purple.dark2,
      };
    case TaskStatus.SystemFailed:
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
      return {
        fill: purple.dark2,
        border: purple.dark3,
        text: purple.light3,
      };

    default:
      return {};
  }
};

export default TaskStatusBadge;
