import {
  PatchTriggerAlias,
  ProjectBuildVariant,
  VariantTask,
} from "gql/generated/types";
import { convertArrayToObject, mapStringArrayToObject } from "utils/array";
import { VariantTasksState } from "./types";

// Takes in variant tasks and default selected tasks and returns an object
// With merged variant and default selected tasks auto selected.
const initializeTaskState = (
  variantTasks: ProjectBuildVariant[],
  defaultSelectedTasks: VariantTask[],
): VariantTasksState => {
  const defaultTasks = convertArrayToObject(defaultSelectedTasks, "name");
  return variantTasks.reduce(
    (prev, { name: variant, tasks }) => ({
      ...prev,
      [variant]: {
        ...mapStringArrayToObject(tasks, false),
        ...(defaultTasks[variant]
          ? mapStringArrayToObject(defaultTasks[variant].tasks, true)
          : {}),
      },
    }),
    {},
  );
};

const initializeAliasState = (patchTriggerAliases: PatchTriggerAlias[]) =>
  patchTriggerAliases.reduce(
    (prev, { alias }) => ({
      ...prev,
      [alias]: false,
    }),
    {},
  );

export { initializeTaskState, initializeAliasState };
