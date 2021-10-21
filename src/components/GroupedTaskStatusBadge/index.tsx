import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { getVersionRoute } from "constants/routes";
import {
  taskStatusToCopy,
  mapUmbrellaStatusColors,
  mapUmbrellaStatusToQueryParam,
} from "constants/task";
import { TaskStatus } from "types/task";
import { applyStrictRegex } from "utils/string";

interface Props {
  status: TaskStatus;
  count: number;
  onClick?: () => void;
  statusCounts?: { [key: string]: number };
  versionId: string;
  variant?: string;
}

export const GroupedTaskStatusBadge: React.FC<Props> = ({
  count,
  status,
  onClick = () => undefined,
  statusCounts,
  versionId,
  variant,
}) => {
  const href = getVersionRoute(versionId, {
    statuses: mapUmbrellaStatusToQueryParam[status],
    ...(variant && { variant: applyStrictRegex(variant) }),
  });
  const { fill, border, text } = mapUmbrellaStatusColors[status];
  return (
    <Tooltip
      enabled={!!statusCounts}
      align="top"
      justify="middle"
      popoverZIndex={1}
      trigger={
        <Link to={href} onClick={onClick} data-cy="grouped-task-status-badge">
          <BadgeContainer fill={fill} border={border} text={text}>
            <Number>{count}</Number>
            <Status>{taskStatusToCopy[status]}</Status>
          </BadgeContainer>
        </Link>
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
  height: 28px;
  width: 64px;
  border-radius: 3px;
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
  font-size: 11px;
  font-weight: bold;
  line-height: 8px;
`;

const Status = styled.span`
  font-size: 8px;
  white-space: nowrap;
`;

const Count = styled.span`
  font-weight: bold;
  margin-left: 5px;
`;
