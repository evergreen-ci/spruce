import { UndispatchedTasksQuery } from "gql/generated/types";

interface BVGroupEntry {
  tasks: { id: string; displayName: string }[];
  buildVariantDisplayName: string;
  buildVariant: string;
}
interface BVGroupsInterface {
  [buildVariantKey: string]: BVGroupEntry;
}
interface State {
  sortedBuildVariantGroups: BVGroupEntry[];
  selectedTasks: Set<string>;
  allTasks: string[];
}

type Action =
  | { type: "ingestData"; taskData?: UndispatchedTasksQuery }
  | { type: "toggleTask"; taskId: string }
  | { type: "toggleBuildVariant"; buildVariant: string }
  | { type: "reset" }
  | { type: "toggleSelectAll" };

export const reducer = (state: State, action: Action): State => {
  const { allTasks, selectedTasks, sortedBuildVariantGroups } = state;
  switch (action.type) {
    case "ingestData":
      return {
        ...state,
        sortedBuildVariantGroups: getSortedBuildVariantGroups(action.taskData),
        allTasks: action.taskData?.version?.tasks?.data.map(({ id }) => id),
      };
    case "toggleTask":
      return {
        ...state,
        selectedTasks: toggleItemsById(selectedTasks, [action.taskId]),
      };
    case "toggleBuildVariant":
      return {
        ...state,
        selectedTasks: toggleItemsById(
          selectedTasks,
          sortedBuildVariantGroups
            .find(({ buildVariant }) => action.buildVariant === buildVariant)
            ?.tasks.map(({ id }) => id) ?? [],
        ),
      };
    case "toggleSelectAll":
      return {
        ...state,
        selectedTasks:
          selectedTasks.size === allTasks.length
            ? new Set()
            : new Set(allTasks),
      };
    case "reset":
      return { ...state, selectedTasks: new Set() };
    default:
      throw new Error();
  }
};

export const initialState: State = {
  sortedBuildVariantGroups: [],
  selectedTasks: new Set(),
  allTasks: [],
};

const getSortedBuildVariantGroups = (
  data?: UndispatchedTasksQuery,
): BVGroupEntry[] => {
  const bvGroups: BVGroupsInterface = data?.version?.tasks?.data.reduce(
    (acc, task) => {
      const { buildVariant, buildVariantDisplayName, displayName, id } = task;
      if (!acc[buildVariant]) {
        acc[buildVariant] = {
          tasks: [{ id, displayName }],
          buildVariantDisplayName,
          buildVariant,
        };
      } else {
        acc[buildVariant].tasks.push({ id, displayName });
      }
      return acc;
    },
    {},
  );
  // sort the build variants
  const sortedBuildVariants = Object.values(bvGroups ?? {}).sort((a, b) =>
    a.buildVariantDisplayName.localeCompare(b.buildVariantDisplayName),
  );
  // sort the tasks
  sortedBuildVariants.forEach(({ tasks }) => {
    tasks.sort((a, b) => a.displayName.localeCompare(b.displayName));
  });

  return sortedBuildVariants;
};

// Remove all items if all are in the set, add all items if some are in the set.
const toggleItemsById = (set: Set<string>, ids: string[]): Set<string> => {
  const allInSet = ids.every((id) => set.has(id));
  if (allInSet) {
    ids.forEach((id) => set.delete(id));
  } else {
    ids.forEach((id) => set.add(id));
  }
  return new Set(set);
};
