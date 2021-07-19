import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Square } from "components/StatusSquare";
import { mapTaskStatusToColor } from "constants/task";

interface TaskStatusCheckboxProps {
  displayName: string;
  status: string;
  taskId: string;
  checked: boolean;
  baseStatus?: string;
  style: React.CSSProperties; // passed in by react-window to handle list virtualization
}

const CheckboxComponent: React.FC<TaskStatusCheckboxProps> = ({
  taskId,
  status,
  baseStatus,
  displayName,
  checked,
  style,
}) => (
  <Checkbox
    style={style}
    data-cy="task-status-checkbox"
    className="task-checkbox"
    name={taskId}
    label={
      <StateItemWrapper>
        <PaddedSquare color={mapTaskStatusToColor[status]} />
        {baseStatus && (
          <PaddedSquare color={mapTaskStatusToColor[baseStatus]} />
        )}
        {displayName}
      </StateItemWrapper>
    }
    checked={checked}
    bold={false}
  />
);

export const TaskStatusCheckbox = React.memo(CheckboxComponent);

const PaddedSquare = styled(Square)`
  margin-right: 6px;
`;

const StateItemWrapper = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
`;
