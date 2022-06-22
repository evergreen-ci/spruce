export enum ResourceType {
  TASK = "TASK",
  VERSION = "VERSION",
  BUILD = "BUILD",
}

export enum ProjectTriggerLevel {
  TASK = "task",
  BUILD = "build",
}

export enum TriggerType {
  OUTCOME = "outcome",
  FAILURE = "failure",
  SUCCESS = "success",
  RUNTIME_CHANGE = "runtime-change",
  EXCEEDS_DURATION = "exceeds-duration",
  TASK_STARTED = "task-started",
  TASK_FAILED_OR_BLOCKED = "task-failed-or-blocked",
  REGRESSION = "regression",
  TEST_REGRESSION = "regression-by-test",
  FIRST_FAILURE_BUILD = "first-failure-in-build",
  FIRST_FAILURE_VERSION = "first-failure-in-version",
  FIRST_FAILURE_VERSION_NAME = "first-failure-in-version-with-name",
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
  ANY_BUILD_FINISHES = "any-build-finishes",
  ANY_BUILD_FAILS = "any-build-fails",
  ANY_TASK_FINISHES = "any-task-finishes",
  ANY_TASK_FAILS = "any-task-fails",
  FIRST_FAILURE_VERSION = "first-failure-version",
  FIRST_FAILURE_BUILD = "first-failure-build",
  FIRST_FAILURE_TASK = "first-failure-version-task",
  PREVIOUS_PASSING_TASK_FAILS = "previous-passing-task-fails",
  PREVIOUS_PASSING_TEST_FAILS = "previous-passing-test-fails",
  TASK_EXCEEDS_DURATION = "project-task-exceeds-duration",
  SUCCESSFUL_TASK_RUNTIME_CHANGES = "successful-task-runtime-change",
  VERSION_EXCEEDS_DURATION = "project-version-exceeds-duration",
  VERSION_RUNTIME_CHANGE = "project-version-runtime-change",
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

export const RenotifyDefaultTime = "48";

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

export interface ExtraField {
  text: string;
  key: string;
  fieldType?: string;
  options?: StringMap;
  default?: string;
  format?: string;
  dataCy?: string;
}

export type RegexSelectorType = "display-name" | "build-variant";

export interface RegexSelector {
  type: RegexSelectorType;
  typeLabel: string;
}

export interface StringMap {
  [index: string]: string;
}

export interface Target {
  "jira-comment"?: string;
  email?: string;
  slack?: string;
}

export interface SubscriptionMethodControl {
  dropdown: string;
  label: string;
  placeholder: string;
  targetPath: string;
  format: string;
}

export interface SubscriptionMethods {
  "jira-comment": SubscriptionMethodControl;
  email: SubscriptionMethodControl;
  slack: SubscriptionMethodControl;

  // Below is for project basis ONLY
  "jira-issue"?: SubscriptionMethodControl;
  "evergreen-webhook"?: SubscriptionMethodControl;
}
