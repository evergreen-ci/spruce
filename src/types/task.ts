import { TableProps } from "antd/es/table";
import { TestSortCategory } from "gql/generated/types";

export enum RequiredQueryParams {
  Sort = "sortDir",
  Category = "sortBy",
  Statuses = "statuses",
  TestName = "testname",
  Page = "page",
  Limit = "limit",
  Execution = "execution",
}

// TODO: Remove SortBy-Limit in favor of generic TableQueryParams
export enum PatchTasksQueryParams {
  SortBy = "sortBy",
  SortDir = "sortDir",
  Sorts = "sorts",
  Page = "page",
  Limit = "limit",
  Statuses = "statuses",
  BaseStatuses = "baseStatuses",
  Variant = "variant",
  TaskName = "taskName",
  Duration = "duration",
}

export const mapFilterParamToId = {
  [RequiredQueryParams.Statuses]: TestSortCategory.Status,
  [RequiredQueryParams.TestName]: TestSortCategory.TestName,
} as const;

export const mapIdToFilterParam = Object.entries(mapFilterParamToId).reduce(
  (accum, [id, param]) => ({
    ...accum,
    [param]: id,
  }),
  {}
);

export type TableOnChange<D> = TableProps<D>["onChange"];

export enum TaskTab {
  Logs = "logs",
  Tests = "tests",
  Files = "files",
  ExecutionTasks = "execution-tasks",
  Annotations = "annotations",
  TrendCharts = "trend-charts",
}

export enum LogTypes {
  Agent = "agent",
  System = "system",
  Task = "task",
  Event = "event",
  All = "all",
}

export enum QueryParams {
  LogType = "logtype",
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
  WillRun = "will-run",
  Unscheduled = "unscheduled",

  // TaskStarted indicates a task is currently running
  Started = "started",

  // TaskDispatched indicates that an agent has received the task, but
  // the agent has not yet told Evergreen that it's running the task
  Dispatched = "dispatched",

  // This is a temporary status which is the same as undispatched, but
  // with the additional info that it's waiting for a dependency
  Pending = "pending",

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
  Blocked = "blocked",
  Aborted = "aborted",

  KnownIssue = "known-issue",

  FailedUmbrella = "failed-umbrella",
  SystemFailureUmbrella = "system-failure-umbrella",
  RunningUmbrella = "running-umbrella",
  UndispatchedUmbrella = "undispatched-umbrella",
  ScheduledUmbrella = "scheduled-umbrella",
}

export enum TaskEventType {
  TaskFinished = "TASK_FINISHED",
  TaskStarted = "TASK_STARTED",
  TaskDispatched = "TASK_DISPATCHED",
  TaskBlocked = "TASK_BLOCKED",
  TaskUndispatched = "TASK_UNDISPATCHED",
  TaskCreated = "TASK_CREATED",
  TaskRestarted = "TASK_RESTARTED",
  TaskActivated = "TASK_ACTIVATED",
  TaskJiraAlertCreated = "TASK_JIRA_ALERT_CREATED",
  TaskDeactivated = "TASK_DEACTIVATED",
  TaskAbortRequest = "TASK_ABORT_REQUEST",
  TaskScheduled = "TASK_SCHEDULED",
  TaskPriorityChanged = "TASK_PRIORITY_CHANGED",
  TaskDependenciesOverridden = "TASK_DEPENDENCIES_OVERRIDDEN",
  MergeTaskUnscheduled = "MERGE_TASK_UNSCHEDULED",
  ContainerAllocated = "CONTAINER_ALLOCATED",
}
