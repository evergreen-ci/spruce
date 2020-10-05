import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { mapVariantTaskStatusToColor, Square } from "components/StatusSquare";

interface TaskStatusCheckboxProps {
  displayName: string;
  status: string;
  taskId: string;
  checked: boolean;
}

const CheckboxComponent: React.FC<TaskStatusCheckboxProps> = ({
  taskId,
  status,
  displayName,
  checked,
}) => (
  <Checkbox
    data-cy="task-status-checkbox"
    className="task-checkbox"
    name={taskId}
    label={
      <StateItemWrapper className="thing">
        <PaddedSquare color={mapVariantTaskStatusToColor[status]} />{" "}
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
`;
