import { uiColors } from "@leafygreen-ui/palette";
import { ALL_VALUE, TreeDataEntry } from "components/TreeSelect";
import { purple } from "constants/colors";
import { TaskStatus } from "types/task";

const { gray, red, yellow, green } = uiColors;

export const taskStatusToCopy = {
  [TaskStatus.ScheduledUmbrella]: "Scheduled",
  [TaskStatus.FailedUmbrella]: "Failed / Timed Out",
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
    title: taskStatusToCopy[TaskStatus.FailedUmbrella],
    value: TaskStatus.FailedUmbrella,
    key: TaskStatus.FailedUmbrella,
    children: [
      {
        title: taskStatusToCopy[TaskStatus.Failed],
        value: TaskStatus.Failed,
        key: TaskStatus.Failed,
      },
      {
        title: taskStatusToCopy[TaskStatus.TaskTimedOut],
        value: TaskStatus.TaskTimedOut,
        key: TaskStatus.TaskTimedOut,
      },
      {
        title: taskStatusToCopy[TaskStatus.TestTimedOut],
        value: TaskStatus.TestTimedOut,
        key: TaskStatus.TestTimedOut,
      },
      {
        title: taskStatusToCopy[TaskStatus.KnownIssue],
        value: TaskStatus.KnownIssue,
        key: TaskStatus.KnownIssue,
      },
    ],
  },
  {
    title: taskStatusToCopy[TaskStatus.Succeeded],
    value: TaskStatus.Succeeded,
    key: TaskStatus.Succeeded,
  },
  {
    title: taskStatusToCopy[TaskStatus.RunningUmbrella],
    value: TaskStatus.RunningUmbrella,
    key: TaskStatus.RunningUmbrella,
    children: [
      {
        title: taskStatusToCopy[TaskStatus.Started],
        value: TaskStatus.Started,
        key: TaskStatus.Started,
      },
      {
        title: taskStatusToCopy[TaskStatus.Dispatched],
        value: TaskStatus.Dispatched,
        key: TaskStatus.Dispatched,
      },
    ],
  },
  {
    title: taskStatusToCopy[TaskStatus.ScheduledUmbrella],
    value: TaskStatus.ScheduledUmbrella,
    key: TaskStatus.ScheduledUmbrella,
    children: [
      {
        title: taskStatusToCopy[TaskStatus.WillRun],
        value: TaskStatus.WillRun,
        key: TaskStatus.WillRun,
      },
      {
        title: taskStatusToCopy[TaskStatus.Pending],
        value: TaskStatus.Pending,
        key: TaskStatus.Pending,
      },
      {
        title: taskStatusToCopy[TaskStatus.Unstarted],
        value: TaskStatus.Unstarted,
        key: TaskStatus.Unstarted,
      },
    ],
  },
  {
    title: taskStatusToCopy[TaskStatus.SystemFailureUmbrella],
    value: TaskStatus.SystemFailureUmbrella,
    key: TaskStatus.SystemFailureUmbrella,
    children: [
      {
        title: taskStatusToCopy[TaskStatus.SystemFailed],
        value: TaskStatus.SystemFailed,
        key: TaskStatus.SystemFailed,
      },
      {
        title: taskStatusToCopy[TaskStatus.SystemTimedOut],
        value: TaskStatus.SystemTimedOut,
        key: TaskStatus.SystemTimedOut,
      },
      {
        title: taskStatusToCopy[TaskStatus.SystemUnresponsive],
        value: TaskStatus.SystemUnresponsive,
        key: TaskStatus.SystemUnresponsive,
      },
    ],
  },
  {
    title: taskStatusToCopy[TaskStatus.UndispatchedUmbrella],
    value: TaskStatus.UndispatchedUmbrella,
    key: TaskStatus.UndispatchedUmbrella,
    children: [
      {
        title: taskStatusToCopy[TaskStatus.Unscheduled],
        value: TaskStatus.Unscheduled,
        key: TaskStatus.Unscheduled,
      },
      {
        title: taskStatusToCopy[TaskStatus.Aborted],
        value: TaskStatus.Aborted,
        key: TaskStatus.Aborted,
      },
      {
        title: taskStatusToCopy[TaskStatus.Blocked],
        value: TaskStatus.Blocked,
        key: TaskStatus.Blocked,
      },
    ],
  },
  {
    title: taskStatusToCopy[TaskStatus.SetupFailed],
    value: TaskStatus.SetupFailed,
    key: TaskStatus.SetupFailed,
  },
];

export const mapTaskStatusToUmbrellaStatus: {
  [key: string]: string;
} = taskStatuses.reduce((accum, { value: parentValue, children }) => {
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
} = taskStatuses.reduce((accum, { value, children }) => {
  if (children) {
    return {
      ...accum,
      [value]: [value, ...children?.map((child) => child.value)],
    };
  }
  return { ...accum, [value]: [value] };
}, {});

export const taskStatusesFilterTreeData: TreeDataEntry[] = [
  {
    title: "All",
    value: ALL_VALUE,
    key: ALL_VALUE,
  },
  ...taskStatuses,
];

export const mapUmbrellaStatusColors = {
  [TaskStatus.UndispatchedUmbrella]: {
    fill: gray.light3,
    border: gray.light2,
    text: gray.dark1,
  },
  [TaskStatus.RunningUmbrella]: {
    fill: yellow.light3,
    border: yellow.light2,
    text: yellow.dark2,
  },
  [TaskStatus.SystemFailureUmbrella]: {
    fill: purple.base,
    border: purple.dark1,
    text: purple.light1,
  },
  [TaskStatus.UndispatchedUmbrella]: {
    fill: gray.light3,
    border: gray.light2,
    text: gray.dark1,
  },
  [TaskStatus.ScheduledUmbrella]: {
    fill: gray.dark1,
    border: gray.dark2,
    text: gray.light3,
  },
  [TaskStatus.FailedUmbrella]: {
    fill: red.light3,
    border: red.light2,
    text: red.dark2,
  },
  [TaskStatus.Succeeded]: {
    fill: green.light3,
    border: green.light2,
    text: green.dark2,
  },
  [TaskStatus.SetupFailed]: {
    fill: purple.light1,
    border: purple.light2,
    text: purple.base,
  },
};

export const mapTaskToBarchartColor = {
  [TaskStatus.UndispatchedUmbrella]: gray.dark1,
  [TaskStatus.RunningUmbrella]: yellow.base,
  [TaskStatus.SystemFailureUmbrella]: purple.base,
  [TaskStatus.UndispatchedUmbrella]: gray.dark1,
  [TaskStatus.ScheduledUmbrella]: gray.base,
  [TaskStatus.FailedUmbrella]: red.base,
  [TaskStatus.Succeeded]: green.base,
  [TaskStatus.SetupFailed]: purple.light1,
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
