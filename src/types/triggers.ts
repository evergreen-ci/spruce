export enum ResourceType {
  Build = "BUILD",
  CommitQueue = "COMMIT_QUEUE",
  Host = "HOST",
  Patch = "PATCH",
  Task = "TASK",
  Version = "VERSION",
}

export enum ProjectTriggerLevel {
  TASK = "task",
  BUILD = "build",
  PUSH = "push",
}

export enum TriggerType {
  OUTCOME = "outcome",
  FAILURE = "failure",
  SUCCESS = "success",
  RUNTIME_CHANGE = "runtime-change",
  EXCEEDS_DURATION = "exceeds-duration",
  SUCCESSFUL_EXCEEDS_DURATION = "successful-exceeds-duration",
  TASK_STARTED = "task-started",
  TASK_FAILED_OR_BLOCKED = "task-failed-or-blocked",
  REGRESSION = "regression",
  TEST_REGRESSION = "regression-by-test",
  FIRST_FAILURE_BUILD = "first-failure-in-build",
  FIRST_FAILURE_VERSION = "first-failure-in-version",
  FIRST_FAILURE_VERSION_NAME = "first-failure-in-version-with-name",

  // Family triggers are for patches with child patches.
  FAMILY_OUTCOME = "family-outcome",
  FAMILY_FAILURE = "family-failure",
  FAMILY_SUCCESS = "family-success",
}

export enum TaskTriggers {
  TASK_STARTS = "task-starts",
  TASK_FINISHES = "task-finishes",
  TASK_FAILS = "task-fails",
  TASK_FAILS_OR_BLOCKED = "task-fails-or-blocked",
  TASK_SUCCEEDS = "task-succeeds",
  TASK_EXCEEDS_DURATION = "task-exceeds-duration",
  TASK_RUNTIME_CHANGE = "task-runtime-change",
}

export enum VersionTriggers {
  VERSION_FINISHES = "version-finishes",
  VERSION_FAILS = "version-fails",
  VERSION_SUCCEEDS = "version-succeeds",
  VERSION_EXCEEDS_DURATION = "version-exceeds-duration",
  VERSION_RUNTIME_CHANGE = "version-runtime-change",
  BUILD_VARIANT_FINISHES = "build-variant-finishes",
  BUILD_VARIANT_FAILS = "build-variant-fails",
  BUILD_VARIANT_SUCCEEDS = "build-variant-succeeds",
}

export enum ProjectTriggers {
  ANY_VERSION_FINISHES = "any-version-finishes",
  ANY_VERSION_FAILS = "any-version-fails",
  ANY_VERSION_SUCCEEDS = "any-version-succeeds",
  ANY_BUILD_FINISHES = "any-build-finishes",
  ANY_BUILD_FAILS = "any-build-fails",
  ANY_BUILD_SUCCEEDS = "any-build-succeeds",
  ANY_TASK_FINISHES = "any-task-finishes",
  ANY_TASK_FAILS = "any-task-fails",
  FIRST_FAILURE_VERSION = "first-failure-version",
  FIRST_FAILURE_BUILD = "first-failure-build",
  FIRST_FAILURE_TASK = "first-failure-version-task",
  PREVIOUS_PASSING_TASK_FAILS = "previous-passing-task-fails",
  PREVIOUS_PASSING_TEST_FAILS = "previous-passing-test-fails",
  TASK_EXCEEDS_DURATION = "project-task-exceeds-duration",
  SUCCESSFUL_TASK_EXCEEDS_DURATION = "successful-project-task-exceeds-duration",
  SUCCESSFUL_TASK_RUNTIME_CHANGES = "successful-task-runtime-change",
}

export enum ExtraFieldKey {
  RENOTIFY_INTERVAL = "renotify-interval",
  TEST_REGEX = "test-regex",
  TASK_DURATION_SECS = "task-duration-secs",
  TASK_PERCENT_CHANGE = "task-percent-change",
  VERSION_PERCENT_CHANGE = "version-percent-change",
  VERSION_DURATION_SECS = "version-duration-secs",
  BUILD_INITIATOR = "requester",
  FAILURE_TYPE = "failure-type",
}

type PayloadResourceIdKey = "in-version" | "in-build" | "id";

export interface Trigger {
  [key: string]: {
    trigger: string;
    label: string;
    extraFields?: ExtraField[];
    resourceType: ResourceType;
    payloadResourceIdKey?: PayloadResourceIdKey;
    regexSelectors?: RegexSelector[];
  };
}

export interface StringMap {
  [index: string]: string;
}
export interface ExtraField {
  text: string;
  key: string;
  fieldType: "input" | "select";
  options?: StringMap;
  default?: string;
  format?: string;
}

export type RegexSelectorType = "display-name" | "build-variant";

export interface RegexSelector {
  type: RegexSelectorType;
  typeLabel: string;
}
