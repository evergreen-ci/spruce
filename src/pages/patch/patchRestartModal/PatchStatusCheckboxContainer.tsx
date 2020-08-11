import React from "react";
import styled from "@emotion/styled";
import { PatchBuildVariantTask } from "gql/generated/types";
import { selectedStrings } from "hooks/usePatchStatusSelect";
import { TaskStatusCheckbox } from "pages/patch/patchRestartModal/TaskStatusCheckbox";

interface PatchStatusCheckboxContainerProps {
  tasks: PatchBuildVariantTask[];
  selectedTasks: selectedStrings;
  toggleSelectedTask: (id: string) => void;
}
export const PatchStatusCheckboxContainer: React.FC<PatchStatusCheckboxContainerProps> = ({
  tasks,
  selectedTasks,
  toggleSelectedTask,
}) => (
  <ScrollableContainer data-cy="patch-status-selector-container">
    {tasks.map((task) => (
      <TaskStatusCheckbox
        task={task}
        selectedTasks={selectedTasks}
        toggleSelectedTask={toggleSelectedTask}
        key={`task_checkbox_${task.id}`}
      />
    ))}
  </ScrollableContainer>
);

const ScrollableContainer = styled("div")`
  max-height: 250px;
  overflow-y: scroll;
`;
