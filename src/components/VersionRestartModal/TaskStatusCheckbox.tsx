import { memo } from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { size } from "constants/tokens";

interface TaskStatusCheckboxProps {
  baseStatus?: string;
  checked: boolean;
  displayName: string;
  onClick: () => void;
  status: string;
  taskId: string;
}

const CheckboxComponent: React.FC<TaskStatusCheckboxProps> = ({
  baseStatus,
  checked,
  displayName,
  onClick,
  status,
  taskId,
}) => (
  <Checkbox
    onClick={onClick}
    data-cy="task-status-checkbox"
    name={taskId}
    label={
      <StateItemWrapper>
        <TaskStatusIcon status={status} />
        {baseStatus ? <TaskStatusIcon status={baseStatus} /> : <EmptyCell />}
        <div>{displayName}</div>
      </StateItemWrapper>
    }
    checked={checked}
    bold={false}
  />
);

export const TaskStatusCheckbox = memo(CheckboxComponent);

const StateItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${size.xxs};
  white-space: nowrap;
`;

const EmptyCell = styled.span`
  width: ${size.s};
`;
