import React from "react";
import { FixedSizeList } from "react-window";
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
}) => {
  const possibleListHeight = tasks.length * itemSize;
  const listHeight =
    possibleListHeight < maxListHeight ? possibleListHeight : maxListHeight;
  const toggleHandler = (e) => {
    const { name } = e.target;
    if (selectedTasks[name] !== undefined) {
      toggleSelectedTask(name);
    }
  };
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
    <div data-cy="patch-status-selector-container" onClick={toggleHandler}>
      <FixedSizeList
        height={listHeight}
        itemSize={itemSize}
        itemCount={tasks.length}
        itemData={tasks}
      >
        {({ style, data, index }) => {
          const { id: taskId, status, name: displayName } = data[index];
          const checked = !!selectedTasks[taskId];
          return (
            <TaskStatusCheckbox
              style={style}
              checked={checked}
              displayName={displayName}
              key={taskId}
              status={status}
              taskId={taskId}
            />
          );
        }}
      </FixedSizeList>
    </div>
  );
};

const itemSize = 20;
const maxListHeight = 250;
