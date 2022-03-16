import { getTaskRoute } from "constants/routes";
import { TaskStatus } from "types/task";
import { statuses } from "utils";
import { CommitTask, CommitType } from "./types";

const { isFinishedTaskStatus } = statuses;

interface State {
  parentTask: CommitTask;
  lastPassingTask: CommitTask;
  lastExecutedTask: CommitTask;
  selectState: CommitType;
  disableButton: boolean;
  link: string;
  shouldFetchLastPassing: boolean;
  hasFetchedLastPassing: boolean;
  shouldFetchLastExecuted: boolean;
  hasFetchedLastExecuted: boolean;
}

// a link cannot be null, so it's common to use # as a substitute.
const nullLink = "#";

// Note that the state doesn't include a field for shouldFetchParent / hasFetchedParent as the parent task
// is always fetched on render.
export const initialState: State = {
  parentTask: null,
  lastPassingTask: null,
  lastExecutedTask: null,
  selectState: CommitType.Base,
  disableButton: true,
  link: nullLink,
  shouldFetchLastPassing: false,
  hasFetchedLastPassing: false,
  shouldFetchLastExecuted: false,
  hasFetchedLastExecuted: false,
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
    hasFetchedLastPassing,
    hasFetchedLastExecuted,
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
          hasFetchedLastPassing: true,
          shouldFetchLastPassing: false,
          link: getTaskRoute(action.task.id),
          disableButton: false,
        };
      }
      return {
        ...state,
        hasFetchedLastPassing: true,
        shouldFetchLastPassing: false,
        disableButton: true,
      };
    }
    case "setLastExecutedTask": {
      if (action.task) {
        return {
          ...state,
          lastExecutedTask: action.task,
          hasFetchedLastExecuted: true,
          shouldFetchLastExecuted: false,
          link: getTaskRoute(action.task.id),
          disableButton: false,
        };
      }
      return {
        ...state,
        hasFetchedLastExecuted: true,
        shouldFetchLastExecuted: false,
        disableButton: true,
      };
    }
    case "setSelectState": {
      const newSelectState = action.selectState;

      // If the user has selected the Last Passing option, set shouldFetchPassing to true if the task needs
      // to be fetched. This will trigger the query in the useEffect hook.
      if (newSelectState === CommitType.LastPassing) {
        const triggerFetchLastPassing = shouldFetchLastPassingTask(
          parentTask,
          lastPassingTask
        );

        if (!hasFetchedLastPassing && triggerFetchLastPassing) {
          return {
            ...state,
            selectState: newSelectState,
            shouldFetchLastPassing: true,
          };
        }
      }

      // If the user has selected the Last Executed option, set shouldFetchExecuted to true if the task
      // needs to be fetched. This will trigger the query in the useEffect hook.
      if (newSelectState === CommitType.LastExecuted) {
        const triggerFetchLastExecuted = shouldFetchLastExecutedTask(
          parentTask,
          lastExecutedTask
        );
        if (!hasFetchedLastExecuted && triggerFetchLastExecuted) {
          return {
            ...state,
            selectState: newSelectState,
            shouldFetchLastExecuted: true,
          };
        }
      }

      // If the selectState has changed and nothing needs to be fetched, just update the link and determine
      // if the GO button should be disabled.
      const newLink = determineNewLink(
        parentTask,
        lastPassingTask,
        lastExecutedTask,
        newSelectState
      );

      const lastPassingTaskDoesNotExist =
        newSelectState === CommitType.LastPassing &&
        hasFetchedLastPassing &&
        !lastPassingTask;

      const lastExecutedTaskDoesNotExist =
        newSelectState === CommitType.LastExecuted &&
        hasFetchedLastExecuted &&
        !lastExecutedTask;

      return {
        ...state,
        selectState: newSelectState,
        link: newLink,
        disableButton:
          newLink === nullLink ||
          lastPassingTaskDoesNotExist ||
          lastExecutedTaskDoesNotExist,
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
const determineNewLink = (
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
  return nullLink;
};
