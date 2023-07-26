import { palette } from "@leafygreen-ui/palette";
import { ALL_VALUE, TreeDataEntry } from "components/TreeSelect";
import { TaskStatus } from "types/task";

const { gray, green, purple, red, yellow } = palette;

export const taskStatusToCopy = {
  [TaskStatus.ScheduledUmbrella]: "Scheduled",
  [TaskStatus.FailedUmbrella]: "Failed",
  [TaskStatus.RunningUmbrella]: "Running",
  [TaskStatus.SystemFailureUmbrella]: "System Failed",
  [TaskStatus.UndispatchedUmbrella]: "Undispatched",
  [TaskStatus.Aborted]: "Aborted",
  [TaskStatus.Blocked]: "Blocked",
  [TaskStatus.Dispatched]: "Dispatched",
  [TaskStatus.Failed]: "Failed",
  [TaskStatus.KnownIssue]: "Known Issue",
  [TaskStatus.Pending]: "Pending",
  [TaskStatus.Started]: "Running",
  [TaskStatus.SystemFailed]: "System Failed",
  [TaskStatus.SystemTimedOut]: "System Timed Out",
  [TaskStatus.SystemUnresponsive]: "System Unresponsive",
  [TaskStatus.SetupFailed]: "Setup Failed",
  [TaskStatus.Succeeded]: "Succeeded",
  [TaskStatus.TaskTimedOut]: "Task Timed Out",
  [TaskStatus.TestTimedOut]: "Test Timed Out",
  [TaskStatus.Unstarted]: "Unstarted",
  [TaskStatus.Unscheduled]: "Unscheduled",
  [TaskStatus.WillRun]: "Will Run",
  [TaskStatus.Inactive]: "Inactive",
  [TaskStatus.Undispatched]: "Undispatched",
};

const taskStatuses: TreeDataEntry[] = [
  {
    children: [
      {
        key: TaskStatus.Failed,
        title: taskStatusToCopy[TaskStatus.Failed],
        value: TaskStatus.Failed,
      },
      {
        key: TaskStatus.TaskTimedOut,
        title: taskStatusToCopy[TaskStatus.TaskTimedOut],
        value: TaskStatus.TaskTimedOut,
      },
      {
        key: TaskStatus.TestTimedOut,
        title: taskStatusToCopy[TaskStatus.TestTimedOut],
        value: TaskStatus.TestTimedOut,
      },
      {
        key: TaskStatus.KnownIssue,
        title: taskStatusToCopy[TaskStatus.KnownIssue],
        value: TaskStatus.KnownIssue,
      },
    ],
    key: TaskStatus.FailedUmbrella,
    title: taskStatusToCopy[TaskStatus.FailedUmbrella],
    value: TaskStatus.FailedUmbrella,
  },
  {
    key: TaskStatus.Succeeded,
    title: taskStatusToCopy[TaskStatus.Succeeded],
    value: TaskStatus.Succeeded,
  },
  {
    children: [
      {
        key: TaskStatus.Started,
        title: taskStatusToCopy[TaskStatus.Started],
        value: TaskStatus.Started,
      },
      {
        key: TaskStatus.Dispatched,
        title: taskStatusToCopy[TaskStatus.Dispatched],
        value: TaskStatus.Dispatched,
      },
    ],
    key: TaskStatus.RunningUmbrella,
    title: taskStatusToCopy[TaskStatus.RunningUmbrella],
    value: TaskStatus.RunningUmbrella,
  },
  {
    children: [
      {
        key: TaskStatus.WillRun,
        title: taskStatusToCopy[TaskStatus.WillRun],
        value: TaskStatus.WillRun,
      },
      {
        key: TaskStatus.Pending,
        title: taskStatusToCopy[TaskStatus.Pending],
        value: TaskStatus.Pending,
      },
      {
        key: TaskStatus.Unstarted,
        title: taskStatusToCopy[TaskStatus.Unstarted],
        value: TaskStatus.Unstarted,
      },
    ],
    key: TaskStatus.ScheduledUmbrella,
    title: taskStatusToCopy[TaskStatus.ScheduledUmbrella],
    value: TaskStatus.ScheduledUmbrella,
  },
  {
    children: [
      {
        key: TaskStatus.SystemFailed,
        title: taskStatusToCopy[TaskStatus.SystemFailed],
        value: TaskStatus.SystemFailed,
      },
      {
        key: TaskStatus.SystemTimedOut,
        title: taskStatusToCopy[TaskStatus.SystemTimedOut],
        value: TaskStatus.SystemTimedOut,
      },
      {
        key: TaskStatus.SystemUnresponsive,
        title: taskStatusToCopy[TaskStatus.SystemUnresponsive],
        value: TaskStatus.SystemUnresponsive,
      },
    ],
    key: TaskStatus.SystemFailureUmbrella,
    title: taskStatusToCopy[TaskStatus.SystemFailureUmbrella],
    value: TaskStatus.SystemFailureUmbrella,
  },
  {
    children: [
      {
        key: TaskStatus.Unscheduled,
        title: taskStatusToCopy[TaskStatus.Unscheduled],
        value: TaskStatus.Unscheduled,
      },
      {
        key: TaskStatus.Aborted,
        title: taskStatusToCopy[TaskStatus.Aborted],
        value: TaskStatus.Aborted,
      },
      {
        key: TaskStatus.Blocked,
        title: taskStatusToCopy[TaskStatus.Blocked],
        value: TaskStatus.Blocked,
      },
    ],
    key: TaskStatus.UndispatchedUmbrella,
    title: taskStatusToCopy[TaskStatus.UndispatchedUmbrella],
    value: TaskStatus.UndispatchedUmbrella,
  },
  {
    key: TaskStatus.SetupFailed,
    title: taskStatusToCopy[TaskStatus.SetupFailed],
    value: TaskStatus.SetupFailed,
  },
];

export const mapTaskStatusToUmbrellaStatus: {
  [key: string]: string;
} = taskStatuses.reduce((accum, { children, value: parentValue }) => {
  const childrenParentMapping = children
    ? children.reduce(
        (cAccum, child) => ({ ...cAccum, [child.value]: parentValue }),
        {}
      )
    : { [parentValue]: parentValue };
  return {
    ...accum,
    ...childrenParentMapping,
  };
}, {});

export const mapUmbrellaStatusToQueryParam: {
  [key: string]: string[];
} = taskStatuses.reduce((accum, { children, value }) => {
  if (children) {
    return {
      ...accum,
      [value]: [value, ...children.map((child) => child.value)],
    };
  }
  return { ...accum, [value]: [value] };
}, {});

export const taskStatusesFilterTreeData: TreeDataEntry[] = [
  {
    key: ALL_VALUE,
    title: "All",
    value: ALL_VALUE,
  },
  ...taskStatuses,
];
type ColorScheme = {
  fill: string;
  border: string;
  text: string;
};

export const mapUmbrellaStatusColors: Pick<
  Record<TaskStatus, ColorScheme>,
  | TaskStatus.UndispatchedUmbrella
  | TaskStatus.RunningUmbrella
  | TaskStatus.FailedUmbrella
  | TaskStatus.SystemFailureUmbrella
  | TaskStatus.UndispatchedUmbrella
  | TaskStatus.ScheduledUmbrella
  | TaskStatus.Succeeded
  | TaskStatus.SetupFailed
> = {
  [TaskStatus.UndispatchedUmbrella]: {
    border: gray.light2,
    fill: gray.light3,
    text: gray.dark1,
  },
  [TaskStatus.RunningUmbrella]: {
    border: yellow.light2,
    fill: yellow.light3,
    text: yellow.dark2,
  },
  [TaskStatus.SystemFailureUmbrella]: {
    border: purple.dark3,
    fill: purple.dark2,
    text: purple.light3,
  },
  [TaskStatus.UndispatchedUmbrella]: {
    border: gray.light2,
    fill: gray.light3,
    text: gray.dark1,
  },
  [TaskStatus.ScheduledUmbrella]: {
    border: gray.dark2,
    fill: gray.dark1,
    text: gray.light3,
  },
  [TaskStatus.FailedUmbrella]: {
    border: red.light2,
    fill: red.light3,
    text: red.dark2,
  },
  [TaskStatus.Succeeded]: {
    border: green.light2,
    fill: green.light3,
    text: green.dark2,
  },
  [TaskStatus.SetupFailed]: {
    border: purple.base,
    fill: purple.light2,
    text: purple.dark2,
  },
};

export const mapTaskToBarchartColor = {
  [TaskStatus.UndispatchedUmbrella]: gray.dark1,
  [TaskStatus.RunningUmbrella]: yellow.base,
  [TaskStatus.SystemFailureUmbrella]: purple.dark2,
  [TaskStatus.ScheduledUmbrella]: gray.base,
  [TaskStatus.FailedUmbrella]: red.base,
  [TaskStatus.Succeeded]: green.dark1,
  [TaskStatus.SetupFailed]: purple.light2,
};

// Represents order for waterfall barchart
export const sortedUmbrellaStatus = [
  TaskStatus.Succeeded,
  TaskStatus.FailedUmbrella,
  TaskStatus.SystemFailureUmbrella,
  TaskStatus.SetupFailed,
  TaskStatus.RunningUmbrella,
  TaskStatus.ScheduledUmbrella,
  TaskStatus.UndispatchedUmbrella,
];

export const failedTaskStatuses = [
  TaskStatus.Failed,
  TaskStatus.SetupFailed,
  TaskStatus.SystemFailed,
  TaskStatus.TaskTimedOut,
  TaskStatus.TestTimedOut,
  TaskStatus.KnownIssue,
  TaskStatus.SystemUnresponsive,
  TaskStatus.SystemTimedOut,
];

export const finishedTaskStatuses = [
  ...failedTaskStatuses,
  TaskStatus.Succeeded,
];

// Task name and build variant for the commit queue. Both are owned by Evergreen.
export const mergeTaskName = "merge-patch";
export const mergeTaskVariant = "commit-queue-merge";
