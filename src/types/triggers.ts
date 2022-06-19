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

export enum ExtraFieldKey {
  RENOTIFY_INTERVAL = "renotify-interval",
  TEST_REGEX = "test-regex",
  TASK_DURATION_SECS = "task-duration-secs",
  TASK_PERCENT_CHANGE = "task-percent-change",
  VERSION_PERCENT_CHANGE = "version-percent-change",
  VERSION_DURATION_SECS = "version-duration-secs",
}

export const RenotifyDefaultTime = "48";

type PayloadResourceIdKey = "in-version" | "in-build" | "id";

export interface Trigger {
  [triggerField: string]: {
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
  options?: string[];
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
}
