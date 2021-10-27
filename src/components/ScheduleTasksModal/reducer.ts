import { GetUndispatchedTasksQuery } from "gql/generated/types";

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
  selectedTasks: Set<String>;
}

type Action =
  | { type: "ingestData"; taskData?: GetUndispatchedTasksQuery }
  | { type: "toggleTask"; taskId: string }
  | { type: "toggleBuildVariant"; buildVariant: string };

export const reducer = (state: State, action: Action): State => {
  const { selectedTasks, sortedBuildVariantGroups } = state;
  switch (action.type) {
    case "ingestData":
      return {
        ...state,
        sortedBuildVariantGroups: getSortedBuildVariantGroups(action.taskData),
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
            ?.tasks.map(({ id }) => id) ?? []
        ),
      };
    default:
      throw new Error();
  }
};

export const initialState: State = {
  sortedBuildVariantGroups: [],
  selectedTasks: new Set(),
};

const getSortedBuildVariantGroups = (data?: GetUndispatchedTasksQuery) => {
  const bvGroups: BVGroupsInterface = data?.patchTasks.tasks.reduce(
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
    {}
  );
  // sort the build variants
  const sortedBuildVariants = Object.values(bvGroups ?? {}).sort((a, b) =>
    a.buildVariantDisplayName.localeCompare(b.buildVariantDisplayName)
  );
  // sort the tasks
  sortedBuildVariants.forEach(({ tasks }) => {
    tasks.sort((a, b) => a.displayName.localeCompare(b.displayName));
  });

  return sortedBuildVariants;
};

// Add all items to set if some are in set, remove all items from set if all are in set
const toggleItemsById = (set: Set<String>, ids: String[]) => {
  const someInSet = ids.some((id) => set.has(id));
  if (someInSet) {
    ids.forEach((id) => set.delete(id));
  } else {
    ids.forEach((id) => set.add(id));
  }
  return new Set(set);
};
