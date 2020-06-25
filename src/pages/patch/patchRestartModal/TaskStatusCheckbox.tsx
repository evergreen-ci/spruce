import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { PatchBuildVariantTask } from "gql/generated/types";
import { selectedStrings } from "utils/string";
import {
  Square,
  mapVariantTaskStatusToColor,
} from "pages/patch/buildVariants/variantColors";

interface TaskStatusCheckboxProps {
  task: PatchBuildVariantTask;
  selectedTasks: selectedStrings;
  toggleSelectedTask: (id: string) => void;
}

const CheckboxComponent: React.FC<TaskStatusCheckboxProps> = ({
  task,
  selectedTasks,
  toggleSelectedTask,
}) => (
  <Checkbox
    data-cy="task-status-checkbox"
    onChange={() => toggleSelectedTask(task.id)}
    label={
      <StateItemWrapper>
        <PaddedSquare color={mapVariantTaskStatusToColor[task.status]} />{" "}
        {task.name}
      </StateItemWrapper>
    }
    checked={selectedTasks[task.id]}
    bold={false}
  />
);

const IsEqual = (
  prev: TaskStatusCheckboxProps,
  next: TaskStatusCheckboxProps
) =>
  prev.task.id === next.task.id &&
  prev.selectedTasks[prev.task.id] === next.selectedTasks[next.task.id];

export const TaskStatusCheckbox = React.memo(CheckboxComponent, IsEqual);

const PaddedSquare = styled(Square)`
  margin-right: 6px;
`;

const StateItemWrapper = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
