import { useEffect, useReducer, useState } from "react";
import { PatchBuildVariant } from "gql/generated/types";
import { usePrevious } from "hooks";
import { environmentalVariables } from "utils";

const { getWebWorkerURL } = environmentalVariables;
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

type UpdatedPatchBuildVariantType = Omit<PatchBuildVariant, "tasks"> & {
  tasks?: {
    id: string;
    execution: number;
    displayName: string;
    status: string;
    baseStatus?: string;
  }[];
};
export const usePatchStatusSelect = (
  patchBuildVariants: UpdatedPatchBuildVariantType[]
): HookResult => {
  const [webWorker, setWebWorker] = useState<Worker>();
  useEffect(() => {
    if (window.Worker && !webWorker) {
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
    if (filterTermOrPatchTasksChanged) {
      if (window.Worker && webWorker) {
        webWorker.postMessage({
          patchBuildVariants,
          patchStatusFilterTerm,
          baseStatusFilterTerm,
          selectedTasks,
        });
      } else {
        // fallback in case web workers are not available.
        // This code reflects logic in public/web_worker/patchBuildVariantReduce.js
        // Iterate through PatchBuildVariants and determine if a task should be
        // selected or not based on if the task status correlates with the 2 filters.
        // if 1 of the 2 filters is empty, ignore the empty filter
        const baseStatuses = new Set(baseStatusFilterTerm);
        const statuses = new Set(patchStatusFilterTerm);
        const nextState =
          patchBuildVariants?.reduce(
            (accumA, patchBuildVariant) =>
              patchBuildVariant.tasks?.reduce(
                (accumB, task) => ({
                  ...accumB,
                  [task.id]:
                    (!!patchStatusFilterTerm?.length ||
                      !!baseStatusFilterTerm?.length) &&
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
    if (window.Worker && webWorker) {
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
