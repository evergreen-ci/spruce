import { Virtuoso } from "react-virtuoso";
import { selectedStrings } from "hooks/useVersionTaskStatusSelect";
import { TaskStatusCheckbox } from "./TaskStatusCheckbox";

interface TaskStatusCheckboxContainerProps {
  selectedTasks: selectedStrings;
  tasks: {
    id: string;
    status: string;
    baseStatus?: string;
    displayName: string;
  }[];
  toggleSelectedTask: (taskIds: { [patchId: string]: string }) => void;
  versionId: string;
}
export const TaskStatusCheckboxContainer: React.FC<
  TaskStatusCheckboxContainerProps
> = ({ selectedTasks, tasks, toggleSelectedTask, versionId }) => {
  const possibleListHeight = tasks.length * itemSize;
  const listHeight =
    possibleListHeight < maxListHeight ? possibleListHeight : maxListHeight;

  return (
    <Virtuoso
      style={{ height: listHeight, width: "100%" }}
      totalCount={tasks.length}
      data={tasks}
      itemContent={(_idx, task) => {
        const { baseStatus, displayName, id: taskId, status } = task;
        const checked = !!selectedTasks[taskId];
        return (
          <TaskStatusCheckbox
            onClick={() => {
              if (selectedTasks[taskId] !== undefined) {
                toggleSelectedTask({ [versionId]: taskId });
              }
            }}
            checked={checked}
            displayName={displayName}
            key={taskId}
            status={status}
            baseStatus={baseStatus}
            taskId={taskId}
          />
        );
      }}
    />
  );
};

const itemSize = 20;
const maxListHeight = 250;
