import { useEffect, useReducer } from "react";
import { GroupedBuildVariant } from "gql/generated/types";
import { usePrevious } from "hooks";

export interface selectedStrings {
  [id: string]: boolean | undefined;
}

export type patchSelectedTasks = {
  [id: string]: selectedStrings | undefined;
};

type versionFilters = {
  [versionId: string]: string[];
};

type Action =
  | { type: "setSelectedTasks"; data: patchSelectedTasks }
  | { type: "setPatchStatusFilterTerm"; data: versionFilters }
  | { type: "setBaseStatusFilterTerm"; data: versionFilters };

interface State {
  patchStatusFilterTerm: versionFilters;
  baseStatusFilterTerm: versionFilters;
  selectedTasks: patchSelectedTasks;
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

type FilterSetter = (statuses: versionFilters) => void;

type HookResult = [
  patchSelectedTasks,
  versionFilters,
  versionFilters,
  {
    toggleSelectedTask: (
      taskIds: { [patchId: string]: string } | { [patchId: string]: string[] }
    ) => void;
    setPatchStatusFilterTerm: FilterSetter;
    setBaseStatusFilterTerm: FilterSetter;
  }
];

type UpdatedPatchBuildVariantType = Omit<GroupedBuildVariant, "tasks"> & {
  tasks?: {
    id: string;
    execution: number;
    displayName: string;
    status: string;
    baseStatus?: string;
  }[];
};

type ChildVersions = {
  id: string;
  buildVariants?: UpdatedPatchBuildVariantType[];
}[];
export const usePatchStatusSelect = (
  patchBuildVariants: UpdatedPatchBuildVariantType[],
  versionId: string,
  childVersions: ChildVersions
): HookResult => {
  const [
    { baseStatusFilterTerm, patchStatusFilterTerm, selectedTasks },
    dispatch,
  ] = useReducer(reducer, {
    baseStatusFilterTerm: {},
    patchStatusFilterTerm: {},
    selectedTasks: {},
  });

  const toggleSelectedTask = (
    taskIds: { [versionId: string]: string } | { [versionId: string]: string[] }
  ) => {
    const newState = { ...selectedTasks };
    const taskVersion = Object.keys(taskIds)[0];

    const selected = taskIds[taskVersion];

    if (typeof selected === "string") {
      if (newState[taskVersion][selected]) {
        newState[taskVersion][selected] = false;
      } else {
        newState[taskVersion][selected] = true;
      }
    } else {
      // Enter this condition when a parent checkbox is clicked.
      // If every task is already checked, uncheck them. Otherwise, check them.
      const nextCheckedState = !selected.every(
        (selectedId) => selectedTasks[taskVersion][selectedId]
      );
      selected.forEach((selectedId) => {
        newState[taskVersion][selectedId] = nextCheckedState;
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
      // Iterate through PatchBuildVariants and determine if a task should be
      // selected or not based on if the task status correlates with the 2 filters.
      // if 1 of the 2 filters is empty, ignore the empty filter
      let baseStatuses = new Set(baseStatusFilterTerm[versionId]);
      let statuses = new Set(patchStatusFilterTerm[versionId]);

      let nextState =
        patchBuildVariants?.reduce(
          (accumA, patchBuildVariant) =>
            patchBuildVariant.tasks?.reduce(
              (accumB, task) => ({
                ...accumB,
                [task.id]:
                  (!!baseStatusFilterTerm[versionId]?.length ||
                    !!patchStatusFilterTerm[versionId]?.length) &&
                  (patchStatusFilterTerm[versionId]?.length
                    ? statuses.has(task.status)
                    : true) &&
                  (baseStatusFilterTerm[versionId]?.length
                    ? baseStatuses.has(task.baseStatus)
                    : true),
              }),
              accumA
            ),
          { ...selectedTasks[versionId] }
        ) ?? {};

      const newTaskSelect = { [versionId]: nextState };

      childVersions?.forEach((cv) => {
        baseStatuses = new Set(baseStatusFilterTerm[cv.id]);
        statuses = new Set(patchStatusFilterTerm[cv.id]);
        nextState =
          cv.buildVariants?.reduce(
            (accumA, patchBuildVariant) =>
              patchBuildVariant.tasks?.reduce(
                (accumB, task) => ({
                  ...accumB,
                  [task.id]:
                    (!!patchStatusFilterTerm[cv.id]?.length ||
                      !!baseStatusFilterTerm[cv.id]?.length) &&
                    (patchStatusFilterTerm[cv.id]?.length
                      ? statuses.has(task.status)
                      : true) &&
                    (baseStatusFilterTerm[cv.id]?.length
                      ? baseStatuses.has(task.baseStatus)
                      : true),
                }),
                accumA
              ),
            { ...selectedTasks[cv.id] }
          ) ?? {};

        newTaskSelect[cv.id] = nextState;
      });

      dispatch({ type: "setSelectedTasks", data: newTaskSelect });
    }
  }, [
    baseStatusFilterTerm,
    childVersions,
    patchBuildVariants,
    patchStatusFilterTerm,
    prevBaseStatusFilterTerm,
    prevPatchBuildVariants,
    prevPatchStatusFilterTerm,
    selectedTasks,
    versionId,
  ]);

  const setPatchStatusFilterTerm = (statuses: versionFilters) => {
    const vId = Object.keys(statuses)[0];

    const nextState = { ...patchStatusFilterTerm };
    nextState[vId] = statuses[vId];
    dispatch({ type: "setPatchStatusFilterTerm", data: nextState });
  };
  const setBaseStatusFilterTerm = (statuses: versionFilters) => {
    const vId = Object.keys(statuses)[0];

    const nextState = { ...baseStatusFilterTerm };
    nextState[vId] = statuses[vId];
    dispatch({ type: "setBaseStatusFilterTerm", data: nextState });
  };
  return [
    selectedTasks,
    patchStatusFilterTerm,
    baseStatusFilterTerm,
    { toggleSelectedTask, setPatchStatusFilterTerm, setBaseStatusFilterTerm },
  ];
};
