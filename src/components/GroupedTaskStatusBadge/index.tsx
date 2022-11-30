import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { GetVersionRouteOptions, getVersionRoute } from "constants/routes";
import {
  taskStatusToCopy,
  mapUmbrellaStatusColors,
  mapUmbrellaStatusToQueryParam,
} from "constants/task";
import { fontSize, size, zIndex } from "constants/tokens";
import { TaskStatus } from "types/task";

interface GroupedTaskStatusBadgeProps {
  count: number;
  onClick?: () => void;
  status: TaskStatus;
  statusCounts?: { [key: string]: number };
  versionId: string;
  queryParamsToPreserve?: GetVersionRouteOptions;
}

export const GroupedTaskStatusBadge: React.VFC<GroupedTaskStatusBadgeProps> = ({
  count,
  onClick = () => undefined,
  status,
  statusCounts,
  versionId,
  queryParamsToPreserve = {},
}) => {
  const href = getVersionRoute(versionId, {
    ...queryParamsToPreserve,
    statuses: mapUmbrellaStatusToQueryParam[status],
  });

  const { fill, border, text } = mapUmbrellaStatusColors[status];

  return (
    <Tooltip
      enabled={!!statusCounts}
      align="top"
      justify="middle"
      popoverZIndex={zIndex.tooltip}
      darkMode
      trigger={
        <div>
          <Link
            to={href}
            onClick={() => onClick()}
            data-cy="grouped-task-status-badge"
          >
            <BadgeContainer fill={fill} border={border} text={text}>
              <Number>{count}</Number>
              <Status>{taskStatusToCopy[status]}</Status>
            </BadgeContainer>
          </Link>
        </div>
      }
      triggerEvent="hover"
    >
      <div data-cy="grouped-task-status-badge-tooltip">
        {statusCounts &&
          Object.entries(statusCounts).map(([taskStatus, taskCount]) => (
            <Row key={taskStatus}>
              <TaskStatusIcon status={taskStatus} size={16} />
              <span>
                <Count>{taskCount}</Count>{" "}
                {taskStatusToCopy[taskStatus] ?? taskStatus}
              </span>
            </Row>
          ))}
      </div>
    </Tooltip>
  );
};

interface BadgeColorProps {
  border?: string;
  fill?: string;
  text?: string;
}

const BadgeContainer = styled.div<BadgeColorProps>`
  height: ${size.l};
  width: ${size.xl};
  border-radius: ${size.xxs};
  border: 1px solid;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  ${({ border }) => border && `border-color: ${border};`}
  ${({ fill }) => fill && `background-color: ${fill};`}
  ${({ text }) => text && `color: ${text};`}
`;

const Row = styled.div`
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

const Number = styled.span`
  font-size: ${fontSize.m};
  font-weight: bold;
  line-height: ${fontSize.m};
`;

const Status = styled.span`
  font-size: ${size.xs};
  white-space: nowrap;
`;

const Count = styled.span`
  font-weight: bold;
  margin-left: ${size.xxs};
`;
