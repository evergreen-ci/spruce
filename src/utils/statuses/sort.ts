import { TaskStatus } from "types/task";

const ordering = [
  // red
  new Set([
    TaskStatus.Failed,
    TaskStatus.TestTimedOut,
    TaskStatus.TaskTimedOut,
  ]),
  // lavender
  new Set([TaskStatus.SetupFailed]),
  // purple
  new Set([
    TaskStatus.SystemFailed,
    TaskStatus.SystemUnresponsive,
    TaskStatus.SystemTimedOut,
  ]),
  // yellow
  new Set([TaskStatus.Started, TaskStatus.Dispatched]),
  // grey statuses fall here
  // green
  new Set([TaskStatus.Succeeded]),
];

const greyStatusIndex = 3.5;

export const sortTasks = (a, b): number => {
  const findGroup = (needle) => {
    const i = ordering.findIndex((haystack) => haystack.has(needle));
    return i === -1 ? greyStatusIndex : i;
  };

  const aIndex = findGroup(a);
  const bIndex = findGroup(b);

  if (aIndex < bIndex) {
    return -1;
  }
  if (bIndex < aIndex) {
    return 1;
  }
  return 0;
};
