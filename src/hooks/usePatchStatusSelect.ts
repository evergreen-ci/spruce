import { useState, useEffect } from "react";
import { PatchBuildVariant } from "gql/generated/types";

export const usePatchStatusSelect = (
  patchBuildVariants: PatchBuildVariant[]
): [
  string[],
  string[],
  {
    setValidStatus: (newValue: string[]) => void;
    toggleSelectedTask: (id: string) => void;
  }
] => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [validStatus, setValidStatus] = useState<string[]>([]);

  const toggleSelectedTask = (id: string) => {
    const idIndex = selectedTasks.indexOf(id);
    if (idIndex !== -1) {
      const tempTasks = [...selectedTasks];
      tempTasks.splice(idIndex, 1);
      setSelectedTasks(tempTasks);
    } else {
      const tempTasks = [...selectedTasks];
      tempTasks.push(id);
      setSelectedTasks(tempTasks);
    }
  };

  // Iterate through PatchBuildVariants and determine if a task should be selected or not
  // Based on if the task status correlates with the validStatus filter
  useEffect(() => {
    if (patchBuildVariants) {
      let tempSelectedTasks = [...selectedTasks];
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

const removeTaskFromSelectedTasks = (id: string, selectedTasks: string[]) => {
  const idIndex = selectedTasks.indexOf(id);
  if (idIndex !== -1) {
    const tempTasks = [...selectedTasks];
    tempTasks.splice(idIndex);
    return tempTasks;
  }
  return selectedTasks;
};

const addTaskToSelectedTasks = (id: string, selectedTasks: string[]) => {
  const idIndex = selectedTasks.indexOf(id);
  if (idIndex === -1) {
    const tempTasks = [...selectedTasks];
    tempTasks.push(id);
    return tempTasks;
  }
  return selectedTasks;
};
