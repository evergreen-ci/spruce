import { VariantTask } from "gql/generated/types";
import { AliasState, ChildPatchAliased } from "hooks/useConfigurePatch";
import { CheckboxState } from "./types";

type TaskState = {
  checkboxState: CheckboxState;
  activated: boolean;
};
interface DeduplicateTasksResult {
  [task: string]: TaskState;
}
/**
 * `deduplicateTasks` takes an array of objects containing the tasks for each build variant
 * @param currentTasks - an array of objects containing the tasks for each build variant
 * @param previouslyActivatedBuildvariants - an array of objects containing the tasks for each build variant that were previously activated
 * @param filterTerm - a string to filter the tasks by
 * @returns - an object containing the deduplicated tasks for each build variant
 */
const deduplicateTasks = (
  currentTasks: {
    [task: string]: boolean;
  }[],
  previouslyActivatedBuildvariants: VariantTask[],
  filterTerm: RegExp,
): DeduplicateTasksResult => {
  const visibleTasks: DeduplicateTasksResult = {};
  currentTasks.forEach((bv, i) => {
    const previouslyActivatedTasks = previouslyActivatedBuildvariants[i]?.tasks;
    Object.entries(bv).forEach(([taskName, value]) => {
      if (filterTerm && !filterTerm.test(taskName)) {
        return;
      }
      switch (visibleTasks[taskName]?.checkboxState) {
        case CheckboxState.Unchecked:
          // If a task is Unchecked and the next task of the same name is Checked it is Indeterminate
          visibleTasks[taskName].checkboxState = value
            ? CheckboxState.Indeterminate
            : CheckboxState.Unchecked;
          break;
        case CheckboxState.Checked:
          // If a task is Checked and the next task of the same name is Unchecked it is Indeterminate
          visibleTasks[taskName].checkboxState = value
            ? CheckboxState.Checked
            : CheckboxState.Indeterminate;
          break;
        case CheckboxState.Indeterminate:
          // If a task is Indeterminate because of previous task statuses
          // it wouldn't change when subsequent statuses are considered
          break;
        default:
          visibleTasks[taskName] = {
            checkboxState: value
              ? CheckboxState.Checked
              : CheckboxState.Unchecked,
            activated: false,
          };
          break;
      }
      if (previouslyActivatedTasks?.includes(taskName)) {
        visibleTasks[taskName].activated = true;
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
 * - The select all checkbox is Checked if all tasks and aliases are Checked
 * - The select all checkbox is Unchecked if all tasks and aliases are Unchecked
 * - The select all checkbox is Indeterminate if some tasks and aliases are checked
 * - The select all checkbox is Checked by default if a child patch is selected
 * - The select all checkbox is Checked if all aliases are Checked and the child patch tasks are shown
 */
const getSelectAllCheckboxState = (
  buildVariants: {
    [task: string]: TaskState;
  },
  aliases: {
    [alias: string]: CheckboxState;
  },
  shouldShowChildPatchTasks: boolean,
): CheckboxState => {
  if (shouldShowChildPatchTasks) {
    return CheckboxState.Checked;
  }

  let state: CheckboxState;
  const allTaskStatuses = Object.values(buildVariants);
  const allAliasStatuses = Object.values(aliases);

  const hasSelectedTasks =
    allTaskStatuses.some((t) => isTaskCheckboxChecked(t)) ||
    allAliasStatuses.includes(CheckboxState.Checked);
  const hasUnselectedTasks =
    allTaskStatuses.some((t) => isTaskCheckboxUnchecked(t)) ||
    allAliasStatuses.includes(CheckboxState.Unchecked);

  const hasIndeterminateTasks = allTaskStatuses.some((t) =>
    isTaskCheckboxIndeterminate(t),
  );

  if (hasSelectedTasks && !hasUnselectedTasks && !hasIndeterminateTasks) {
    state = CheckboxState.Checked;
  } else if (
    !hasSelectedTasks &&
    hasUnselectedTasks &&
    !hasIndeterminateTasks
  ) {
    state = CheckboxState.Unchecked;
  } else {
    state = CheckboxState.Indeterminate;
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
  selectedBuildVariants: string[],
): { [key: string]: CheckboxState } => {
  const visiblePatches = {};
  Object.entries(selectedAliases).forEach(([alias]) => {
    if (selectedBuildVariants.includes(alias)) {
      visiblePatches[alias] = selectedAliases[alias]
        ? CheckboxState.Checked
        : CheckboxState.Unchecked;
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
  selectedBuildVariants: string[],
): ChildPatchAliased[] => {
  if (!childPatches) {
    return [];
  }

  return childPatches.filter(({ alias }) =>
    selectedBuildVariants.includes(alias),
  );
};

/**
 * `isTaskCheckboxIndeterminate` takes the state of the checkbox and returns a boolean indicating whether the checkbox is Indeterminate
 * @param task - the state of the checkbox
 * @returns - a boolean indicating whether the checkbox is Indeterminate
 */
const isTaskCheckboxIndeterminate = (task: TaskState): boolean =>
  task.checkboxState === CheckboxState.Indeterminate;

/**
 * `isTaskCheckboxChecked` takes the state of the checkbox and returns a boolean indicating whether the checkbox is checked
 * @param task - the state of the checkbox
 * @returns - a boolean indicating whether the checkbox is checked
 */
const isTaskCheckboxChecked = (task: TaskState): boolean =>
  task.checkboxState === CheckboxState.Checked;

/**
 * `isTaskCheckboxUnchecked` takes the state of the checkbox and returns a boolean indicating whether the checkbox is checked
 * @param task - the state of the checkbox
 * @returns - a boolean indicating whether the checkbox is checked
 */
const isTaskCheckboxUnchecked = (task: TaskState): boolean =>
  task.checkboxState === CheckboxState.Unchecked;

/**
 * `isTaskCheckboxActivated` takes the state of the checkbox and returns a boolean indicating whether the task checkbox is already activated
 * @param task - the state of the checkbox
 * @returns - a boolean indicating whether the checkbox is already activated
 */
const isTaskCheckboxActivated = (task: TaskState): boolean => task.activated;

export {
  isTaskCheckboxIndeterminate,
  isTaskCheckboxChecked,
  isTaskCheckboxActivated,
  deduplicateTasks,
  getSelectAllCheckboxState,
  getVisibleAliases,
  getVisibleChildPatches,
};
