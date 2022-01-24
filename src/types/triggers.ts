export enum ResourceType {
  TASK = "TASK",
  VERSION = "VERSION",
  BUILD = "BUILD",
}

export enum TriggerType {
  OUTCOME = "outcome",
  FAILURE = "failure",
  RUNTIME_CHANGE = "runtime-change",
  EXCEEDS_DURATION = "exceeds-duration",
  REGRESSION = "regression",
  TEST_REGRESSION = "regression-by-test",
  FIRST_FAILURE_BUILD = "first-failure-in-build",
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
  trigger: string;
  label: string;
  extraFields?: ExtraField[];
  resourceType: ResourceType;
  payloadResourceIdKey?: PayloadResourceIdKey;
  regexSelectors?: RegexSelector[];
}

export interface ExtraField {
  text: string;
  key: string;
  type?: string;
  options?: StringMap;
  default?: string;
  validator?: (v: any) => string;
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
