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
  <ScrollableContainer
    onClick={(e) => {
      // @ts-ignore
      const { name } = e.target;
      if (selectedTasks[name] !== undefined) {
        toggleSelectedTask(name);
      }
    }}
    data-cy="patch-status-selector-container"
  >
    {tasks.map((task) => (
      <TaskStatusCheckbox
        checked={!!selectedTasks[task.id]}
        displayName={task.name}
        key={task.id}
        status={task.status}
        taskId={task.id}
      />
    ))}
  </ScrollableContainer>
);

const ScrollableContainer = styled("div")`
  max-height: 250px;
  overflow-y: scroll;
`;

interface TaskCheckboxProps {
  label: string;
  id: string;
  checked: boolean;
  toggleSelectedTask: (id: string) => void;
}
