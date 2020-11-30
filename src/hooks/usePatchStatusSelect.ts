import { useEffect, useReducer } from "react";
import { PatchBuildVariant } from "gql/generated/types";
import { usePrevious } from "hooks";

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
  const [
    { baseStatusFilterTerm, patchStatusFilterTerm, selectedTasks },
    dispatch,
  ] = useReducer(reducer, {
    baseStatusFilterTerm: [],
    patchStatusFilterTerm: [],
    selectedTasks: {},
  });

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
  // if only 1 of the 2 filters contains a filter term, ignore the empty filter
  const prevSelectedTasks = usePrevious(selectedTasks);
  useEffect(() => {
    if (prevSelectedTasks !== selectedTasks) {
      const baseStatuses = new Set(baseStatusFilterTerm);
      const statuses = new Set(patchStatusFilterTerm);
      const nextState =
        patchBuildVariants?.reduce(
          (accumA, patchBuildVariant) =>
            patchBuildVariant.tasks?.reduce(
              (accumB, task) => ({
                ...accumB,
                [task.id]:
                  (patchStatusFilterTerm?.length ||
                    baseStatusFilterTerm?.length) &&
                  (patchStatusFilterTerm?.length
                    ? statuses.has(task.status)
                    : true) &&
                  (baseStatusFilterTerm?.length
                    ? baseStatuses.has(task.baseStatus)
                    : true),
              }),
              accumA
            ),
          { ...selectedTasks }
        ) ?? {};
      dispatch({ type: "setSelectedTasks", data: nextState });
    }
  }, [
    patchBuildVariants,
    patchStatusFilterTerm,
    baseStatusFilterTerm,
    selectedTasks,
    prevSelectedTasks,
  ]);

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
