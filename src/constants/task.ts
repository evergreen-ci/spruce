import { ALL_VALUE, TreeDataEntry } from "components/TreeSelect";
import { TaskStatus } from "types/task";

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
        value: TaskStatus.Known,
        key: TaskStatus.Known,
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
    value: TaskStatus.StatusBlocked,
    key: TaskStatus.StatusBlocked,
  },
  {
    title: "Won't Run",
    value: TaskStatus.Inactive,
    key: TaskStatus.Inactive,
  },
];
