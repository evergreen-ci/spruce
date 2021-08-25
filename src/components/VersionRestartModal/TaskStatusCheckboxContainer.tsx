import React from "react";
import { FixedSizeList } from "react-window";
import { selectedStrings } from "hooks/usePatchStatusSelect";
import { TaskStatusCheckbox } from "./TaskStatusCheckbox";

interface TaskStatusCheckboxContainerProps {
  versionId: string;
  tasks: {
    id: string;
    status: string;
    baseStatus?: string;
    displayName: string;
  }[];
  selectedTasks: selectedStrings;
  toggleSelectedTask: (taskIds: { [patchId: string]: string }) => void;
}
export const TaskStatusCheckboxContainer: React.FC<TaskStatusCheckboxContainerProps> = ({
  versionId,
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
      toggleSelectedTask({ [versionId]: name });
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
          const { id: taskId, status, baseStatus, displayName } = data[index];
          const checked = !!selectedTasks[taskId];
          return (
            <TaskStatusCheckbox
              style={style}
              checked={checked}
              displayName={displayName}
              key={taskId}
              status={status}
              baseStatus={baseStatus}
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
