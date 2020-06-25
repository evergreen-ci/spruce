import { useState, useEffect } from "react";
import { PatchBuildVariant } from "gql/generated/types";
import { selectedStrings } from "utils/string";

export const usePatchStatusSelect = (
  patchBuildVariants: PatchBuildVariant[]
): [
  selectedStrings,
  string[],
  {
    setValidStatus: (newValue: string[]) => void;
    toggleSelectedTask: (id: string) => void;
  }
] => {
  const [selectedTasks, setSelectedTasks] = useState<selectedStrings>({});
  const [validStatus, setValidStatus] = useState<string[]>([]);

  const toggleSelectedTask = (id: string) => {
    const newState = { ...selectedTasks };
    if (newState[id]) {
      newState[id] = false;
    } else {
      newState[id] = true;
    }
    setSelectedTasks(newState);
  };

  // Iterate through PatchBuildVariants and determine if a task should be selected or not
  // Based on if the task status correlates with the validStatus filter
  useEffect(() => {
    if (patchBuildVariants) {
      let tempSelectedTasks = selectedTasks;
      patchBuildVariants.forEach((patchBuildVariant) => {
        patchBuildVariant.tasks.forEach((task) => {
          if (validStatus.includes(task.status)) {
            tempSelectedTasks = addTaskToSelectedTasks(
              task.id,
              tempSelectedTasks
            );
          } else {
            tempSelectedTasks = removeTaskFromSelectedTasks(
              task.id,
              tempSelectedTasks
            );
          }
        });
      });
      setSelectedTasks(tempSelectedTasks);
    }
    // Disable exhaustive-deps since selectedTasks in dep array causes a infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patchBuildVariants, validStatus]);

  return [selectedTasks, validStatus, { toggleSelectedTask, setValidStatus }];
};

const removeTaskFromSelectedTasks = (
  id: string,
  selectedTasks: selectedStrings
) => {
  const newSelectedTasks = { ...selectedTasks };
  newSelectedTasks[id] = false;
  return newSelectedTasks;
};

const addTaskToSelectedTasks = (id: string, selectedTasks: selectedStrings) => {
  const newSelectedTasks = { ...selectedTasks };
  newSelectedTasks[id] = true;
  return newSelectedTasks;
};
