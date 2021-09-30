import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { taskStatusToCopy, mapUmbrellaStatusColors } from "constants/task";
import { TaskStatus } from "types/task";
import { pluralize } from "utils/string";

interface Props {
  status: TaskStatus;
  count: number;
  onClick?: () => void;
  statusCounts: { [key: string]: number };
}

export const GroupedTaskStatusBadge: React.FC<Props> = ({
  count,
  status,
  onClick = () => undefined,
  statusCounts,
}) => {
  const statusDisplayName = pluralize(taskStatusToCopy[status], count);

  const { fill, border, text } = mapUmbrellaStatusColors[status];
  return (
    <Tooltip
      usePortal={false}
      align="top"
      justify="middle"
      open
      popoverZIndex={1}
      trigger={
        <BadgeContainer
          fill={fill}
          border={border}
          text={text}
          onClick={onClick}
        >
          <Number>{count}</Number>
          <Status>{statusDisplayName}</Status>
        </BadgeContainer>
      }
      triggerEvent="hover"
    >
      {Object.entries(statusCounts).map(([taskStatus, taskCount]) => (
        <Row>
          <TaskStatusIcon status={taskStatus} size={16} />
          <span>
            <Count umbrellaStatus={status}>{taskCount}</Count>{" "}
            {pluralize(taskStatusToCopy[taskStatus], taskCount)}
          </span>
        </Row>
      ))}
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
