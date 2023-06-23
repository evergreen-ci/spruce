import { AliasState, ChildPatchAliased } from "hooks/useConfigurePatch";
import { CheckboxState } from "./types";

interface DeduplicateTasksResult {
  [task: string]: CheckboxState;
}
/**
 * `deduplicateTasks` takes an array of objects containing the tasks for each build variant
 * @param currentTasks - an array of objects containing the tasks for each build variant
 * @returns - an object containing the deduplicated tasks for each build variant
 */
const deduplicateTasks = (
  currentTasks: {
    [task: string]: boolean;
  }[]
): DeduplicateTasksResult => {
  const visibleTasks: DeduplicateTasksResult = {};
  currentTasks.forEach((bv) => {
    Object.entries(bv).forEach(([taskName, value]) => {
      switch (visibleTasks[taskName]) {
        case CheckboxState.UNCHECKED:
          // If a task is UNCHECKED and the next task of the same name is CHECKED it is INDETERMINATE
          visibleTasks[taskName] = value
            ? CheckboxState.INDETERMINATE
            : CheckboxState.UNCHECKED;
          break;
        case CheckboxState.CHECKED:
          // If a task is CHECKED and the next task of the same name is UNCHECKED it is INDETERMINATE
          visibleTasks[taskName] = value
            ? CheckboxState.CHECKED
            : CheckboxState.INDETERMINATE;
          break;
        case CheckboxState.INDETERMINATE:
          // If a task is INDETERMINATE because of previous task statuses
          // it wouldn't change when subsequent statuses are considered
          break;
        default:
          visibleTasks[taskName] = value
            ? CheckboxState.CHECKED
            : CheckboxState.UNCHECKED;
          break;
      }
    });
  });
  return visibleTasks;
};

/**
 * `getSelectAllCheckboxState` takes the current state of the tasks and aliases and returns the state of the select all checkbox
 * @param buildVariants - an object containing the current state of the tasks for each build variant
 * @param aliases - an object containing the current state of the aliases
 * @param shouldShowChildPatchTasks - a boolean indicating whether the child patch tasks should be shown
 * @returns - the state of the select all checkbox
 * - The select all checkbox is checked if all tasks and aliases are checked
 * - The select all checkbox is unchecked if all tasks and aliases are unchecked
 * - The select all checkbox is indeterminate if some tasks and aliases are checked
 * - The select all checkbox is checked by default if a child patch is selected
 * - The select all checkbox is checked if all aliases are checked and the child patch tasks are shown
 */
const getSelectAllCheckboxState = (
  buildVariants: {
    [task: string]: CheckboxState;
  },
  aliases: {
    [alias: string]: CheckboxState;
  },
  shouldShowChildPatchTasks: boolean
): CheckboxState => {
  if (shouldShowChildPatchTasks) {
    return CheckboxState.CHECKED;
  }

  let state: CheckboxState;
  const allTaskStatuses = Object.values(buildVariants);
  const allAliasStatuses = Object.values(aliases);

  const hasSelectedTasks =
    allTaskStatuses.includes(CheckboxState.CHECKED) ||
    allAliasStatuses.includes(CheckboxState.CHECKED);
  const hasUnselectedTasks =
    allTaskStatuses.includes(CheckboxState.UNCHECKED) ||
    allAliasStatuses.includes(CheckboxState.UNCHECKED);
  if (hasSelectedTasks && !hasUnselectedTasks) {
    state = CheckboxState.CHECKED;
  } else if (!hasSelectedTasks && hasUnselectedTasks) {
    state = CheckboxState.UNCHECKED;
  } else {
    state = CheckboxState.INDETERMINATE;
  }

  return state;
};

/**
 * `getVisibleAliases` takes the current state of the aliases and returns the state of the aliases that are visible
 * @param selectedAliases - an object containing the current state of the aliases
 * @param selectedBuildVariants - an array containing the selected build variants
 * @returns - an object containing the state of the aliases that are visible
 */
const getVisibleAliases = (
  selectedAliases: AliasState,
  selectedBuildVariants: string[]
): { [key: string]: CheckboxState } => {
  const visiblePatches = {};
  Object.entries(selectedAliases).forEach(([alias]) => {
    if (selectedBuildVariants.includes(alias)) {
      visiblePatches[alias] = selectedAliases[alias]
        ? CheckboxState.CHECKED
        : CheckboxState.UNCHECKED;
    }
  });
  return visiblePatches;
};

/**
 * `getVisibleChildPatches` takes the current state of the child patches and returns the state of the child patches that are visible
 * @param childPatches - an array containing the current state of the child patches
 * @param selectedBuildVariants - an array containing the selected build variants
 * @returns - an array containing the state of the child patches that are visible
 * - The child patch is visible if the alias is in the selected build variants
 * - The child patch is checked if the alias is in the selected build variants and the child patch is checked
 */
const getVisibleChildPatches = (
  childPatches: ChildPatchAliased[],
  selectedBuildVariants: string[]
): ChildPatchAliased[] => {
  if (!childPatches) {
    return [];
  }

  return childPatches.filter(({ alias }) =>
    selectedBuildVariants.includes(alias)
  );
};

/**
 * `isCheckboxIndeterminate` takes the state of the checkbox and returns a boolean indicating whether the checkbox is indeterminate
 * @param state - the state of the checkbox
 * @returns - a boolean indicating whether the checkbox is indeterminate
 */
const isCheckboxIndeterminate = (state: CheckboxState): boolean =>
  state === CheckboxState.Indeterminate;

/**
 * `isCheckboxChecked` takes the state of the checkbox and returns a boolean indicating whether the checkbox is checked
 * @param state - the state of the checkbox
 * @returns - a boolean indicating whether the checkbox is checked
 */
const isCheckboxChecked = (state: CheckboxState): boolean =>
  state === CheckboxState.Checked;

export {
  isCheckboxChecked,
  isCheckboxIndeterminate,
  deduplicateTasks,
  getSelectAllCheckboxState,
  getVisibleAliases,
  getVisibleChildPatches,
};
