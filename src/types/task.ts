import { TableProps } from "antd/es/table";

export enum RequiredQueryParams {
  Sort = "sortDir",
  Category = "sortBy",
  Statuses = "statuses",
  TestName = "testname",
  Page = "page",
  Limit = "limit",
  Execution = "execution",
}

export enum PatchTasksQueryParams {
  SortBy = "sortBy",
  SortDir = "sortDir",
  Page = "page",
  Limit = "limit",
  Statuses = "statuses",
  BaseStatuses = "baseStatuses",
  Variant = "variant",
  TaskName = "taskName",
}

export enum TestStatus {
  Fail = "fail",
  Skip = "skip",
  SilentFail = "silentfail",
  Pass = "pass",
  All = "all",
}

export type TableOnChange<D> = TableProps<D>["onChange"];

export enum TaskTab {
  Logs = "logs",
  Tests = "tests",
  Files = "files",
  BuildBaron = "build-baron",
  TrendCharts = "trend-charts",
}

export enum LogTypes {
  Agent = "agent",
  System = "system",
  Task = "task",
  Event = "event",
}

export enum TaskStatus {
  Inactive = "inactive",

  // TaskUnstarted is assigned to a display task after cleaning up one of
  // its execution tasks. This indicates that the display task is
  // pending a rerun
  Unstarted = "unstarted",

  // TaskUndispatched indicates either
  //  1. a task is not scheduled to run (when Task.Activated == false)
  //  2. a task is scheduled to run (when Task.Activated == true)
  Undispatched = "undispatched",

  // TaskStarted indicates a task is currently running
  Started = "started",

  // TaskDispatched indicates that an agent has received the task, but
  // the agent has not yet told Evergreen that it's running the task
  Dispatched = "dispatched",

  // This is a temporary status which is the same as undispatched, but
  // with the additional info that it's waiting for a dependency
  StatusPending = "pending",

  // The statuses below indicate that a task has finished.
  Succeeded = "success",

  // These statuses indicate that the task failed, and it is likely a problem
  // with the code being tested
  Failed = "failed",
  TestTimedOut = "test-timed-out",
  TaskTimedOut = "task-timed-out",

  // These statuses indicate that the task failed, and it is likely a problem
  // with the systems running the task
  SetupFailed = "setup-failed",
  SystemFailed = "system-failed",
  SystemTimedOut = "system-timed-out",
  SystemUnresponsive = "system-unresponsive",

  // This status means that the task will not run because a dependency was
  // not satisfied
  StatusBlocked = "blocked",
}
