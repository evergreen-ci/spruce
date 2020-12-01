import { useEffect, useReducer, useState } from "react";
import { PatchBuildVariant } from "gql/generated/types";
import { usePrevious } from "hooks";
import { getWebWorkerURL } from "utils/getEnvironmentVariables";

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
  const [webWorker, setWebWorker] = useState<Worker>();
  useEffect(() => {
    if (!webWorker) {
      const worker = new Worker(getWebWorkerURL("patchBuildVariantsReduce.js"));
      setWebWorker(worker);
    }
  }, [webWorker]);

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

  // Determine if a task is a selected based on the filter terms and available tasks
  const prevPatchBuildVariants = usePrevious(patchBuildVariants);
  const prevPatchStatusFilterTerm = usePrevious(patchStatusFilterTerm);
  const prevBaseStatusFilterTerm = usePrevious(baseStatusFilterTerm);
  useEffect(() => {
    const filterTermOrPatchTasksChanged =
      patchBuildVariants !== prevPatchBuildVariants ||
      patchStatusFilterTerm !== prevPatchStatusFilterTerm ||
      baseStatusFilterTerm !== prevBaseStatusFilterTerm;
    if (filterTermOrPatchTasksChanged && webWorker) {
      webWorker.postMessage({
        patchBuildVariants,
        patchStatusFilterTerm,
        baseStatusFilterTerm,
        selectedTasks,
      });
    }
  }, [
    baseStatusFilterTerm,
    patchBuildVariants,
    patchStatusFilterTerm,
    prevBaseStatusFilterTerm,
    prevPatchBuildVariants,
    prevPatchStatusFilterTerm,
    selectedTasks,
    webWorker,
  ]);

  // process webworker response
  useEffect(() => {
    if (webWorker) {
      webWorker.onmessage = (event) => {
        dispatch({
          type: "setSelectedTasks",
          data: event.data as selectedStrings,
        });
      };
    }
  }, [webWorker, dispatch]);

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
