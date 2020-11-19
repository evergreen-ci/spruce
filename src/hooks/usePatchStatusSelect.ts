import { useEffect, useReducer } from "react";
import { PatchBuildVariant } from "gql/generated/types";

export interface selectedStrings {
  [id: string]: boolean | undefined;
}

type Action =
  | { type: "setSelectedTasks"; data: selectedStrings }
  | { type: "setPatchStatusFilterTerm"; data: string[] }
  | { type: "setBaseStatusFilterTerm"; data: string[] };

interface State {
  patchStatusFilterTerm: string[];
  baseStatusFilterTerm: string[];
  selectedTasks: selectedStrings;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "setSelectedTasks":
      return {
        ...state,
        selectedTasks: action.data,
      };
    case "setPatchStatusFilterTerm":
      return {
        ...state,
        patchStatusFilterTerm: action.data,
      };
    case "setBaseStatusFilterTerm":
      return {
        ...state,
        baseStatusFilterTerm: action.data,
      };
    default:
      throw new Error();
  }
};

type FilterSetter = (statuses: string[]) => void;

type HookResult = [
  selectedStrings,
  string[],
  string[],
  {
    toggleSelectedTask: (id: string | string[]) => void;
    setPatchStatusFilterTerm: FilterSetter;
    setBaseStatusFilterTerm: FilterSetter;
  }
];

export const usePatchStatusSelect = (
  patchBuildVariants: PatchBuildVariant[]
): HookResult => {
  const [state, dispatch] = useReducer(reducer, {
    baseStatusFilterTerm: [],
    patchStatusFilterTerm: [],
    selectedTasks: {},
  });
  const { baseStatusFilterTerm, patchStatusFilterTerm, selectedTasks } = state;

  const toggleSelectedTask = (id: string | string[]) => {
    const newState = { ...selectedTasks };

    if (typeof id === "string") {
      if (newState[id]) {
        newState[id] = false;
      } else {
        newState[id] = true;
      }
    } else {
      // Enter this condition when a parent checkbox is clicked.
      // If every task is already checked, uncheck them. Otherwise, check them.
      const nextCheckedState = !id.every((taskId) => selectedTasks[taskId]);
      id.forEach((taskId) => {
        newState[taskId] = nextCheckedState;
      });
    }
    dispatch({ type: "setSelectedTasks", data: newState });
  };
  // Iterate through PatchBuildVariants and determine if a task should be
  // selected or not based on if the task status correlates with the 2 filters.
  useEffect(() => {
    if (patchBuildVariants) {
      let tempSelectedTasks = state.selectedTasks;
      patchBuildVariants.forEach((patchBuildVariant) => {
        patchBuildVariant.tasks.forEach((task) => {
          // A task is selected when both filters have a match or when
          // one filter has a match and the other has no active filter terms.
          const isSelected =
            (patchStatusFilterTerm?.length || baseStatusFilterTerm?.length) &&
            (patchStatusFilterTerm?.length
              ? patchStatusFilterTerm.includes(task.status)
              : true) &&
            (task.baseStatus && baseStatusFilterTerm?.length
              ? baseStatusFilterTerm.includes(task.baseStatus)
              : true);

          if (isSelected) {
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
      dispatch({ type: "setSelectedTasks", data: tempSelectedTasks });
    }
    // Disable exhaustive-deps since selectedTasks in dep array causes a infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patchBuildVariants, patchStatusFilterTerm, baseStatusFilterTerm]);

  const setPatchStatusFilterTerm = (statuses: string[]) =>
    dispatch({ type: "setPatchStatusFilterTerm", data: statuses });
  const setBaseStatusFilterTerm = (statuses: string[]) =>
    dispatch({ type: "setBaseStatusFilterTerm", data: statuses });

  return [
    selectedTasks,
    patchStatusFilterTerm,
    baseStatusFilterTerm,
    { toggleSelectedTask, setPatchStatusFilterTerm, setBaseStatusFilterTerm },
  ];
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
