import { uiColors } from "@leafygreen-ui/palette";
import { ALL_VALUE, TreeDataEntry } from "components/TreeSelect";
import { TaskStatus } from "types/task";

const { green, gray, yellow, red, blue } = uiColors;

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
        value: TaskStatus.TaskWillRun,
        key: TaskStatus.TaskWillRun,
      },
      {
        title: "Will Not Run",
        value: TaskStatus.TaskWillNotRun,
        key: TaskStatus.TaskWillNotRun,
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

// Represents background colors for task statuses
export const mapTaskStatusToColor = {
  [TaskStatus.Aborted]: gray.light1,
  [TaskStatus.Blocked]: gray.dark1,
  [TaskStatus.Dispatched]: gray.light1,
  [TaskStatus.Failed]: red.base,
  [TaskStatus.Inactive]: gray.light1,
  [TaskStatus.Known]: blue.base,
  [TaskStatus.Pending]: yellow.base,
  [TaskStatus.SetupFailed]: failureLavender,
  [TaskStatus.Succeeded]: green.base,
  [TaskStatus.Started]: yellow.base,
  [TaskStatus.SystemFailed]: failurePurple,
  [TaskStatus.SystemTimedOut]: failurePurple,
  [TaskStatus.SystemUnresponsive]: failurePurple,
  [TaskStatus.TaskWillRun]: gray.light1,
  [TaskStatus.TaskWillNotRun]: gray.dark2,
  [TaskStatus.TaskTimedOut]: red.base,
  [TaskStatus.TestTimedOut]: red.base,
  [TaskStatus.Undispatched]: gray.light1,
  [TaskStatus.Unstarted]: gray.light1,
};

// Represents text color for task statuses
export const mapTaskStatusToTextColor = {
  [TaskStatus.Aborted]: gray.dark3,
  [TaskStatus.Blocked]: gray.dark3,
  [TaskStatus.Dispatched]: gray.dark3,
  [TaskStatus.Failed]: red.dark3,
  [TaskStatus.Inactive]: gray.dark3,
  [TaskStatus.Known]: blue.dark3,
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
};

export const taskStatusToCopy = {
  [TaskStatus.Aborted]: "Aborted",
  [TaskStatus.Blocked]: "Blocked",
  [TaskStatus.Dispatched]: "Dispatched",
  [TaskStatus.Failed]: "Failed",
  [TaskStatus.Inactive]: "Inactive",
  [TaskStatus.Known]: "Known Failure",
  [TaskStatus.Pending]: "Pending",
  [TaskStatus.Started]: "Running",
  [TaskStatus.SystemFailed]: "System Failed",
  [TaskStatus.SystemTimedOut]: "System Time Out",
  [TaskStatus.SystemUnresponsive]: "System Unresponsive",
  [TaskStatus.SetupFailed]: "Setup Failure",
  [TaskStatus.Succeeded]: "Success",
  [TaskStatus.TaskTimedOut]: "Task-timed-out",
  [TaskStatus.TaskWillRun]: "Will Run",
  [TaskStatus.TaskWillNotRun]: "Will Not Run",
  [TaskStatus.TestTimedOut]: "Test-timed-out",
  [TaskStatus.Unstarted]: "Unstarted",
  [TaskStatus.Undispatched]: "Undispatched",
};
