import { getTaskRoute } from "constants/routes";
import { TaskStatus, CommitTask, CommitType } from "types/task";
import { statuses } from "utils";

const { isFinishedTaskStatus } = statuses;

interface State {
  parentTask: CommitTask;
  lastPassingTask: CommitTask;
  lastExecutedTask: CommitTask;
  selectState: CommitType;
  disableButton: boolean;
  link: string;
  shouldFetchPassing: boolean;
  hasFetchedPassing: boolean;
  shouldFetchExecuted: boolean;
  hasFetchedExecuted: boolean;
}

// Note that the state doesn't include a field for shouldFetchParent / hasFetchedParent as the parent task
// is always fetched on render.
export const initialState: State = {
  parentTask: null,
  lastPassingTask: null,
  lastExecutedTask: null,
  selectState: CommitType.Base,
  disableButton: false,
  link: "/",
  shouldFetchPassing: false,
  hasFetchedPassing: false,
  shouldFetchExecuted: false,
  hasFetchedExecuted: false,
};

type Action =
  | { type: "setParentTask"; task: CommitTask }
  | { type: "setLastPassingTask"; task: CommitTask }
  | { type: "setLastExecutedTask"; task: CommitTask }
  | { type: "setSelectState"; selectState: CommitType };

export const reducer = (state: State, action: Action): State => {
  const {
    parentTask,
    lastPassingTask,
    lastExecutedTask,
    hasFetchedPassing,
    hasFetchedExecuted,
  } = state;

  switch (action.type) {
    case "setParentTask": {
      if (action.task) {
        return {
          ...state,
          parentTask: action.task,
          link: getTaskRoute(action.task.id),
          disableButton: false,
        };
      }
      return {
        ...state,
        disableButton: true,
      };
    }
    case "setLastPassingTask": {
      if (action.task) {
        return {
          ...state,
          lastPassingTask: action.task,
          hasFetchedPassing: true,
          link: getTaskRoute(action.task.id),
          disableButton: false,
        };
      }
      return {
        ...state,
        hasFetchedPassing: true,
        disableButton: true,
      };
    }
    case "setLastExecutedTask": {
      if (action.task) {
        return {
          ...state,
          lastExecutedTask: action.task,
          hasFetchedExecuted: true,
          link: getTaskRoute(action.task.id),
          disableButton: false,
        };
      }
      return {
        ...state,
        hasFetchedExecuted: true,
        disableButton: true,
      };
    }
    case "setSelectState": {
      const newSelectState = action.selectState;

      const shouldFetchLastPassing = shouldFetchLastPassingTask(
        parentTask,
        lastPassingTask
      );
      const shouldFetchLastExecuted = shouldFetchLastExecutedTask(
        parentTask,
        lastExecutedTask
      );

      if (
        !hasFetchedPassing &&
        shouldFetchLastPassing &&
        newSelectState === CommitType.LastPassing
      ) {
        return {
          ...state,
          selectState: newSelectState,
          shouldFetchPassing: true,
        };
      }
      if (
        !hasFetchedExecuted &&
        shouldFetchLastExecuted &&
        newSelectState === CommitType.LastExecuted
      ) {
        return {
          ...state,
          selectState: newSelectState,
          shouldFetchExecuted: true,
        };
      }

      const newLink = determineLink(
        parentTask,
        lastPassingTask,
        lastExecutedTask,
        newSelectState
      );

      return {
        ...state,
        selectState: newSelectState,
        link: newLink,
        disableButton: determineDisabledButton(
          hasFetchedPassing,
          lastPassingTask,
          hasFetchedExecuted,
          lastExecutedTask,
          newSelectState,
          newLink
        ),
      };
    }
    default:
      throw new Error(`Unknown reducer action ${action}`);
  }
};

const shouldFetchLastPassingTask = (
  parentTask: CommitTask,
  lastPassingTask: CommitTask
): boolean => {
  if (
    parentTask &&
    parentTask.status !== TaskStatus.Succeeded &&
    !lastPassingTask
  ) {
    return true;
  }
  return false;
};

const shouldFetchLastExecutedTask = (
  parentTask: CommitTask,
  lastExecutedTask: CommitTask
): boolean => {
  if (
    parentTask &&
    !isFinishedTaskStatus(parentTask.status) &&
    !lastExecutedTask
  ) {
    return true;
  }
  return false;
};

// Determine the value of the link which will be used to redirect the user when they
// press the GO button.
const determineLink = (
  parentTask: CommitTask,
  lastPassingTask: CommitTask,
  lastExecutedTask: CommitTask,
  selectState: CommitType
): string => {
  if (parentTask) {
    switch (selectState) {
      case CommitType.Base:
        return getTaskRoute(parentTask.id);
      // If a parent task succeeded, the last passing commit is the parent task.
      case CommitType.LastPassing:
        return getTaskRoute(lastPassingTask?.id || parentTask.id);
      // If a parent task has finished, the last executed commit is the parent task.
      case CommitType.LastExecuted:
        return getTaskRoute(lastExecutedTask?.id || parentTask.id);
      default:
        break;
    }
  }
  return "/";
};

// Determine whether or not the GO button should be disabled.
const determineDisabledButton = (
  hasFetchedPassing: boolean,
  lastPassingTask: CommitTask,
  hasFetchedExecuted: boolean,
  lastExecutedTask: CommitTask,
  selectState: CommitType,
  link: string
): boolean => {
  const lastPassingTaskDoesNotExist =
    selectState === CommitType.LastPassing &&
    hasFetchedPassing &&
    !lastPassingTask;

  const lastExecutedTaskDoesNotExist =
    selectState === CommitType.LastExecuted &&
    hasFetchedExecuted &&
    !lastExecutedTask;

  return (
    link === "/" || lastPassingTaskDoesNotExist || lastExecutedTaskDoesNotExist
  );
};
