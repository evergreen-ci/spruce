import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { taskStatusToCopy, mapUmbrellaStatusColors } from "constants/task";
import { TaskStatus } from "types/task";
import { pluralize } from "utils/string";

interface Props {
  status: TaskStatus;
  count: number;
  onClick?: () => void;
  statusCounts?: { [key: string]: number };
  href: string;
}

export const GroupedTaskStatusBadge: React.FC<Props> = ({
  count,
  status,
  onClick = () => undefined,
  statusCounts,
  href,
}) => {
  const statusDisplayName = pluralize(taskStatusToCopy[status], count);

  const { fill, border, text } = mapUmbrellaStatusColors[status];
  return (
    <Tooltip
      enabled={!!statusCounts}
      align="top"
      justify="middle"
      popoverZIndex={1}
      trigger={
        <Link to={href}>
          <BadgeContainer
            fill={fill}
            border={border}
            text={text}
            onClick={onClick}
          >
            <Number>{count}</Number>
            <Status>{statusDisplayName}</Status>
          </BadgeContainer>
        </Link>
      }
      triggerEvent="hover"
    >
      <span data-cy="grouped-task-status-badge-tooltip">
        {statusCounts &&
          Object.entries(statusCounts).map(([taskStatus, taskCount]) => (
            <Row key={taskStatus}>
              <TaskStatusIcon status={taskStatus} size={16} />
              <Copy>
                <Count umbrellaStatus={status}>{taskCount}</Count>{" "}
                {pluralize(
                  taskStatusToCopy[taskStatus] ?? taskStatus,
                  taskCount
                )}
              </Copy>
            </Row>
          ))}
      </span>
    </Tooltip>
  );
};

interface BadgeColorProps {
  border?: string;
  fill?: string;
  text?: string;
  onClick: () => void;
}

const BadgeContainer = styled.div<BadgeColorProps>`
  height: 28px;
  width: 60px;
  border-radius: 3px;
  border: 1px solid;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  ${({ onClick }) => onClick && `cursor: pointer`};
  ${({ border }) => border && `border-color: ${border};`}
  ${({ fill }) => fill && `background-color: ${fill};`}
  ${({ text }) => text && `color: ${text};`}
`;

const Row = styled.div`
  white-space: nowrap;
`;

const Number = styled.span`
  font-size: 11px;
  font-weight: bold;
  line-height: 8px;
`;

const Status = styled.span`
  font-size: 8px;
  line-height: 8px;
`;

interface CountProps {
  umbrellaStatus: TaskStatus;
}
const Count = styled.span<CountProps>`
  ${({ umbrellaStatus }) =>
    umbrellaStatus !== TaskStatus.Succeeded && "font-weight: bold;"}
  margin-left: 5px;
`;

const Copy = styled.span`
  position: relative;
  top: -2px;
`;
