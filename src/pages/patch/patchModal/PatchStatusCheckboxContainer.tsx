import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { PatchBuildVariantTask } from "gql/generated/types";
import {
  mapVariantTaskStatusToColor,
  Square,
} from "pages/patch/buildVariants/variantColors";

interface PatchStatusCheckboxContainerProps {
  tasks: PatchBuildVariantTask[];
  selectedTasks: string[];
  toggleSelectedTask: (id: string) => void;
}
export const PatchStatusCheckboxContainer: React.FC<PatchStatusCheckboxContainerProps> = ({
  tasks,
  selectedTasks,
  toggleSelectedTask,
}) => (
  <ScrollableContainer data-cy="patch-status-selector-container">
    {tasks.map((task) => (
      <PatchStatusCheckbox
        key={task.id}
        {...task}
        selectedTasks={selectedTasks}
        toggleSelectedTask={toggleSelectedTask}
      />
    ))}
  </ScrollableContainer>
);

interface PatchStatusCheckboxProps {
  status: string;
  name: string;
  id: string;
  selectedTasks: string[];
  toggleSelectedTask: (id: string) => void;
}
const PatchStatusCheckbox: React.FC<PatchStatusCheckboxProps> = ({
  status,
  name,
  id,
  selectedTasks,
  toggleSelectedTask,
}) => {
  const square = <Square color={mapVariantTaskStatusToColor[status]} />;
  return (
    <Checkbox
      data-cy="task-status-checkbox"
      onChange={() => toggleSelectedTask(id)}
      label={
        <PatchStateItemWrapper>
          {square} {name}
        </PatchStateItemWrapper>
      }
      checked={selectedTasks.includes(id)}
      bold={false}
    />
  );
};

const ScrollableContainer = styled("div")`
  max-height: 250px;
  overflow-y: scroll;
`;
const PatchStateItemWrapper = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
