import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { taskStatusToCopy, mapUmbrellaStatusColors } from "constants/task";
import { fontSize, size, zIndex } from "constants/tokens";
import { TaskStatus } from "types/task";
import { hexToRGBA } from "utils/color";

interface GroupedTaskStatusBadgeProps {
  count: number;
  onClick?: () => void;
  status: TaskStatus;
  statusCounts?: { [key: string]: number };
  href: string;
  isActive?: boolean;
}

export const GroupedTaskStatusBadge: React.VFC<GroupedTaskStatusBadgeProps> = ({
  count,
  onClick = () => undefined,
  status,
  statusCounts,
  href,
  isActive,
}) => {
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
            <BadgeContainer
              fill={fill}
              border={border}
              text={text}
              isActive={isActive}
            >
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
  isActive?: boolean;
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
  line-height: normal;
  ${({ border }) => border && `border-color: ${border};`}
  ${({ fill, isActive }) =>
    fill &&
    `background-color: ${isActive === false ? hexToRGBA(fill, 0.2) : fill};`}
  ${({ text }) => text && `color: ${text};`}
  ${({ isActive }) => isActive && `border-width: 2px;`}

  :hover {
    ${({ isActive, fill }) =>
      `background-color: ${isActive === false ? fill : hexToRGBA(fill, 0.2)};`}
  }
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
`;
