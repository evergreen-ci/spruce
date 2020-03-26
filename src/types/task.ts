import { TableProps } from "antd/es/table";

export interface ValidInitialQueryParams {
  initialCategory: string;
  initialSort: string | string[];
  initialStatuses: string[];
  initialTestName: string;
}

export enum RequiredQueryParams {
  Sort = "sort",
  Category = "category",
  Statuses = "statuses",
  TestName = "testname"
}

export enum SortQueryParam {
  Desc = "-1",
  Asc = "1"
}

export enum PatchTasksQueryParams {
  SortBy = "sortBy",
  SortDir = "sortDir",
  Page = "page",
  Limit = "limit",
  Variant = "variant",
  TaskName = "taskName"
}

export enum TestStatus {
  Fail = "fail",
  Skip = "skip",
  SilentFail = "silentfail",
  Pass = "pass",
  All = "all"
}

export type TableOnChange<D> = TableProps<D>["onChange"];

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

  // TaskStarted indicates a task is running on an agent
  Started = "started",

  // TaskDispatched indicates that an agent has received the task, but
  // the agent has not yet told Evergreen that it's running the task
  Dispatched = "dispatched",

  // The task statuses below indicate that a task has finished.
  Succeeded = "success",

  // These statuses indicate the types of failures that are stored in
  // Task.Status field, build TaskCache and TaskEndDetails.
  Failed = "failed",
  SystemFailed = "system-failed",
  TestTimedOut = "test-timed-out",
  SetupFailed = "setup-failed",

  StatusBlocked = "blocked",
  StatusPending = "pending"
}
