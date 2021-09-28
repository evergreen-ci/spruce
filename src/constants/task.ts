import { uiColors } from "@leafygreen-ui/palette";
import { ALL_VALUE, TreeDataEntry } from "components/TreeSelect";
import { TaskStatus } from "types/task";

const { gray, red, yellow, green } = uiColors;

export const taskStatusToCopy = {
  [TaskStatus.ScheduledUmbrella]: "Scheduled",
  [TaskStatus.FailedUmbrella]: "Failure",
  [TaskStatus.RunningUmbrella]: "Running",
  [TaskStatus.SystemFailureUmbrella]: "System Failure",
  [TaskStatus.UndispatchedUmbrella]: "Undispatched",
  [TaskStatus.Aborted]: "Aborted",
  [TaskStatus.Blocked]: "Blocked",
  [TaskStatus.Dispatched]: "Dispatched",
  [TaskStatus.Failed]: "Failed",
  [TaskStatus.Inactive]: "Inactive",
  [TaskStatus.KnownIssue]: "Known Issue",
  [TaskStatus.Pending]: "Pending",
  [TaskStatus.Started]: "Running",
  [TaskStatus.SystemFailed]: "System Failed",
  [TaskStatus.SystemTimedOut]: "System Time Out",
  [TaskStatus.SystemUnresponsive]: "System Unresponsive",
  [TaskStatus.SetupFailed]: "Setup Failure",
  [TaskStatus.Succeeded]: "Success",
  [TaskStatus.TaskTimedOut]: "Task Timed Out",
  [TaskStatus.TestTimedOut]: "Test Timed Out",
  [TaskStatus.Unstarted]: "Unstarted",
  [TaskStatus.Unscheduled]: "Unscheduled",
  [TaskStatus.WillRun]: "Will Run",
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
  {
    title: taskStatusToCopy[TaskStatus.Inactive],
    value: TaskStatus.Inactive,
    key: TaskStatus.Inactive,
  },
];

export const mapTaskStatusToUmbrellaStatus: {
  [key: string]: string;
} = taskStatuses.reduce(
  // Iterate over task statuses, a list of TreeDataEntry.
  (accum, { value, children }) => ({
    ...accum,
    ...(children // If a children key exists, assign them to their parent and expand.
      ? children.reduce(
          (cAccum, child) => ({ ...cAccum, [child.value]: value }),
          {}
        )
      : { [value]: value }), // If no children key exists, assign the parent value to itself.
  }),
  {}
);

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

const failureLavender = "#F3EDF5";
const failureLavendarDark = "#9982A4";
const failurePurple = "#E6CCE6";
const failurePurpleDark = "#620662";

// Represents the color order for commit bar charts
export const sortedStatusColor = [
  green.base,
  red.base,
  failurePurple,
  gray.light1,
  failureLavender,
  yellow.base,
  gray.dark1,
];

// Represents background colors for task statuses
export const mapTaskStatusToColor = {
  [TaskStatus.UndispatchedUmbrella]: gray.light1,
  [TaskStatus.Aborted]: gray.light1,
  [TaskStatus.Blocked]: gray.dark1,
  [TaskStatus.FailedUmbrella]: red.base,
  [TaskStatus.Failed]: red.base,
  [TaskStatus.Inactive]: gray.light1,
  [TaskStatus.KnownIssue]: red.base,
  [TaskStatus.Pending]: yellow.base,
  [TaskStatus.SetupFailed]: failureLavender,
  [TaskStatus.Succeeded]: green.base,
  [TaskStatus.RunningUmbrella]: yellow.base,
  [TaskStatus.Started]: yellow.base,
  [TaskStatus.Dispatched]: yellow.base,
  [TaskStatus.SystemFailed]: failurePurple,
  [TaskStatus.SystemTimedOut]: failurePurple,
  [TaskStatus.SystemUnresponsive]: failurePurple,
  [TaskStatus.TaskTimedOut]: red.base,
  [TaskStatus.TestTimedOut]: red.base,
  [TaskStatus.Unstarted]: gray.light1,
  [TaskStatus.Unscheduled]: gray.dark1,
  [TaskStatus.WillRun]: gray.light1,
};

// Represents text color for task statuses
export const mapTaskStatusToTextColor = {
  [TaskStatus.UndispatchedUmbrella]: gray.light1,
  [TaskStatus.Aborted]: gray.dark3,
  [TaskStatus.Blocked]: gray.dark3,
  [TaskStatus.FailedUmbrella]: red.dark3,
  [TaskStatus.Failed]: red.dark3,
  [TaskStatus.Inactive]: gray.dark3,
  [TaskStatus.KnownIssue]: red.dark3,
  [TaskStatus.Pending]: yellow.dark3,
  [TaskStatus.SetupFailed]: failureLavendarDark,
  [TaskStatus.RunningUmbrella]: yellow.dark3,
  [TaskStatus.Started]: yellow.dark3,
  [TaskStatus.Dispatched]: yellow.dark3,
  [TaskStatus.Succeeded]: green.dark3,
  [TaskStatus.SystemFailed]: failurePurpleDark,
  [TaskStatus.SystemTimedOut]: failurePurpleDark,
  [TaskStatus.SystemUnresponsive]: failurePurpleDark,
  [TaskStatus.TestTimedOut]: red.dark3,
  [TaskStatus.TaskTimedOut]: red.dark3,
  [TaskStatus.Unstarted]: gray.dark3,
  [TaskStatus.Unscheduled]: gray.light3,
  [TaskStatus.WillRun]: gray.dark1,
};

export const mapBadgeColors = {
  [TaskStatus.Failed]: {
    fill: red.light3,
    border: red.light2,
    text: red.dark2,
  },
  [TaskStatus.SetupFailed]: {
    fill: " #f1f0fc",
    border: "#d5d4f9",
    text: "#4f4fbf",
  },
  [TaskStatus.Succeeded]: {
    fill: green.light3,
    border: green.light2,
    text: green.dark2,
  },
  [TaskStatus.Started]: {
    fill: yellow.light3,
    border: yellow.light2,
    text: yellow.dark2,
  },
  [TaskStatus.SystemFailed]: {
    fill: "#4f4fbf",
    border: "#36367f",
    text: "#f1f0fc",
  },
  [TaskStatus.Undispatched]: {
    fill: gray.light3,
    border: gray.light2,
    text: gray.dark1,
  },
  [TaskStatus.WillRun]: {
    fill: gray.dark1,
    border: gray.dark2,
    text: gray.light3,
  },
  [TaskStatus.FailedUmbrella]: {
    fill: red.light3,
    border: red.light2,
    text: red.dark2,
  },
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
    fill: " #f1f0fc",
    border: "#d5d4f9",
    text: "#4f4fbf",
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
};
