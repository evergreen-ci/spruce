import { uiColors } from "@leafygreen-ui/palette";
import { ALL_VALUE, TreeDataEntry } from "components/TreeSelect";
import { TaskStatus } from "types/task";

const { gray, red, yellow, green } = uiColors;

export const taskStatusesFilterTreeData: TreeDataEntry[] = [
  {
    title: "All",
    value: ALL_VALUE,
    key: ALL_VALUE,
  },
  {
    title: "Failures",
    value: "all-failures",
    key: "all-failures",
    children: [
      {
        title: "Failed",
        value: TaskStatus.Failed,
        key: TaskStatus.Failed,
      },
      {
        title: "Task Timed Out",
        value: TaskStatus.TaskTimedOut,
        key: TaskStatus.TaskTimedOut,
      },
      {
        title: "Test Timed Out",
        value: TaskStatus.TestTimedOut,
        key: TaskStatus.TestTimedOut,
      },
      {
        title: "Aborted",
        value: TaskStatus.Aborted,
        key: TaskStatus.Aborted,
      },
      {
        title: "Known Issue",
        value: TaskStatus.KnownIssue,
        key: TaskStatus.KnownIssue,
      },
    ],
  },
  {
    title: "Success",
    value: TaskStatus.Succeeded,
    key: TaskStatus.Succeeded,
  },
  {
    title: "Dispatched",
    value: TaskStatus.Dispatched,
    key: TaskStatus.Dispatched,
  },
  {
    title: "Running",
    value: TaskStatus.Started,
    key: TaskStatus.Started,
  },
  {
    title: "Unscheduled",
    value: TaskStatus.Unscheduled,
    key: TaskStatus.Unscheduled,
  },
  {
    title: "Scheduled",
    value: "scheduled",
    key: "scheduled",
    children: [
      {
        title: "Unstarted",
        value: TaskStatus.Unstarted,
        key: TaskStatus.Unstarted,
      },
      {
        title: "Undispatched or Blocked",
        value: TaskStatus.Undispatched,
        key: TaskStatus.Undispatched,
      },
      {
        title: "Will Run",
        value: TaskStatus.WillRun,
        key: TaskStatus.WillRun,
      },
    ],
  },
  {
    title: "System Issues",
    value: "system-issues",
    key: "system-issues",
    children: [
      {
        title: "System Failed",
        value: TaskStatus.SystemFailed,
        key: TaskStatus.SystemFailed,
      },
      {
        title: "System Timed Out",
        value: TaskStatus.SystemTimedOut,
        key: TaskStatus.SystemTimedOut,
      },
      {
        title: "System Unresponsive",
        value: TaskStatus.SystemUnresponsive,
        key: TaskStatus.SystemUnresponsive,
      },
    ],
  },
  {
    title: "Setup Failed",
    value: TaskStatus.SetupFailed,
    key: TaskStatus.SetupFailed,
  },
  {
    title: "Aborted",
    value: TaskStatus.Aborted,
    key: TaskStatus.Aborted,
  },
  {
    title: "Blocked",
    value: TaskStatus.Blocked,
    key: TaskStatus.Blocked,
  },
  {
    title: "Won't Run",
    value: TaskStatus.Inactive,
    key: TaskStatus.Inactive,
  },
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
  [TaskStatus.Aborted]: gray.light1,
  [TaskStatus.Blocked]: gray.dark1,
  [TaskStatus.Dispatched]: gray.light1,
  [TaskStatus.Failed]: red.base,
  [TaskStatus.Inactive]: gray.light1,
  [TaskStatus.KnownIssue]: red.base,
  [TaskStatus.Pending]: yellow.base,
  [TaskStatus.SetupFailed]: failureLavender,
  [TaskStatus.Succeeded]: green.base,
  [TaskStatus.Started]: yellow.base,
  [TaskStatus.SystemFailed]: failurePurple,
  [TaskStatus.SystemTimedOut]: failurePurple,
  [TaskStatus.SystemUnresponsive]: failurePurple,
  [TaskStatus.TaskTimedOut]: red.base,
  [TaskStatus.TestTimedOut]: red.base,
  [TaskStatus.Undispatched]: gray.light1,
  [TaskStatus.Unstarted]: gray.light1,
  [TaskStatus.Unscheduled]: gray.dark1,
  [TaskStatus.WillRun]: gray.light1,
};

// Represents text color for task statuses
export const mapTaskStatusToTextColor = {
  [TaskStatus.Aborted]: gray.dark3,
  [TaskStatus.Blocked]: gray.dark3,
  [TaskStatus.Dispatched]: gray.dark3,
  [TaskStatus.Failed]: red.dark3,
  [TaskStatus.Inactive]: gray.dark3,
  [TaskStatus.KnownIssue]: red.dark3,
  [TaskStatus.Pending]: yellow.dark3,
  [TaskStatus.SetupFailed]: failureLavendarDark,
  [TaskStatus.Started]: yellow.dark3,
  [TaskStatus.Succeeded]: green.dark3,
  [TaskStatus.SystemFailed]: failurePurpleDark,
  [TaskStatus.SystemTimedOut]: failurePurpleDark,
  [TaskStatus.SystemUnresponsive]: failurePurpleDark,
  [TaskStatus.TestTimedOut]: red.dark3,
  [TaskStatus.TaskTimedOut]: red.dark3,
  [TaskStatus.Undispatched]: gray.dark3,
  [TaskStatus.Unstarted]: gray.dark3,
  [TaskStatus.Unscheduled]: gray.light3,
  [TaskStatus.WillRun]: gray.dark1,
};

export const taskStatusToCopy = {
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
  [TaskStatus.TaskTimedOut]: "Task-timed-out",
  [TaskStatus.TestTimedOut]: "Test-timed-out",
  [TaskStatus.Undispatched]: "Undispatched",
  [TaskStatus.Unstarted]: "Unstarted",
  [TaskStatus.Unscheduled]: "Unscheduled",
  [TaskStatus.WillRun]: "Will Run",
};

export const mapTaskStatusToUmbrellaStatus = {
  [TaskStatus.Succeeded]: TaskStatus.Succeeded,
  [TaskStatus.Failed]: TaskStatus.Failed,
  [TaskStatus.TaskTimedOut]: TaskStatus.Failed,
  [TaskStatus.TestTimedOut]: TaskStatus.Failed,
  [TaskStatus.KnownIssue]: TaskStatus.Failed,
  [TaskStatus.SystemFailed]: TaskStatus.SystemFailed,
  [TaskStatus.SystemTimedOut]: TaskStatus.SystemFailed,
  [TaskStatus.SystemUnresponsive]: TaskStatus.SystemFailed,
  [TaskStatus.Aborted]: TaskStatus.Dispatched,
  [TaskStatus.Dispatched]: TaskStatus.Dispatched,
  [TaskStatus.Inactive]: TaskStatus.Dispatched,
  [TaskStatus.Undispatched]: TaskStatus.Dispatched,
  [TaskStatus.Unstarted]: TaskStatus.Dispatched,
  [TaskStatus.WillRun]: TaskStatus.Dispatched,
  [TaskStatus.SetupFailed]: TaskStatus.SetupFailed,
  [TaskStatus.Pending]: TaskStatus.Started,
  [TaskStatus.Started]: TaskStatus.Started,
  [TaskStatus.Blocked]: TaskStatus.Unscheduled,
  [TaskStatus.Unscheduled]: TaskStatus.Unscheduled,
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
};
