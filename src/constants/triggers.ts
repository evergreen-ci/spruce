import {
  ExtraField,
  ExtraFieldKey,
  RegexSelector,
  RenotifyDefaultTime,
  ResourceType,
  StringMap,
  Trigger,
  TriggerType,
  TaskTriggers,
  VersionTriggers,
  ProjectTriggers,
} from "types/triggers";

export const buildRegexSelectors: RegexSelector[] = [
  {
    type: "display-name",
    typeLabel: "Build Variant Name",
  },
  {
    type: "build-variant",
    typeLabel: "Build Variant ID",
  },
];

export const taskRegexSelectors: RegexSelector[] = [
  {
    type: "display-name",
    typeLabel: "Task Name",
  },
  {
    type: "build-variant",
    typeLabel: "Build Variant Name",
  },
];

export const failureTypeSubscriberOptions = {
  any: "Any",
  test: "Test",
  system: "System",
  setup: "Setup",
};

export const failureTypeSubscriberConfig = {
  text: "Failure Type",
  key: ExtraFieldKey.FAILURE_TYPE,
  fieldType: "select",
  default: "any",
  options: failureTypeSubscriberOptions,
};

export const requesterSubscriberOptions = {
  gitter_request: "Commit",
  patch_request: "Patch",
  github_pull_request: "Pull Request",
  merge_test: "Commit Queue",
  ad_hoc: "Periodic Build",
};

export const requesterSubscriberConfig = {
  text: "Build Initiator",
  key: ExtraFieldKey.BUILD_INITIATOR,
  fieldType: "select",
  default: "gitter_request",
  options: requesterSubscriberOptions,
};

export const clearExtraFieldsInputCb = (accum: StringMap, eF: ExtraField) => ({
  ...accum,
  [eF.key]: "10",
});

export const taskTriggers: Trigger = {
  [TaskTriggers.TASK_STARTS]: {
    trigger: TriggerType.TASK_STARTED,
    label: "This task starts",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  [TaskTriggers.TASK_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    label: "This task finishes",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  [TaskTriggers.TASK_FAILS]: {
    trigger: TriggerType.FAILURE,
    label: "This task fails",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  [TaskTriggers.TASK_FAILS_OR_BLOCKED]: {
    trigger: TriggerType.TASK_FAILED_OR_BLOCKED,
    label: "This task fails or is blocked",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  [TaskTriggers.TASK_SUCCEEDS]: {
    trigger: TriggerType.SUCCESS,
    label: "This task succeeds",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  [TaskTriggers.TASK_EXCEEDS_DURATION]: {
    trigger: TriggerType.EXCEEDS_DURATION,
    label: "The runtime for this task exceeds some duration",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Task duration (seconds)",
        fieldType: "input",
        key: ExtraFieldKey.TASK_DURATION_SECS,
        dataCy: "duration-secs-input",
        format: "validDuration",
        default: "10",
      },
    ],
  },
  [TaskTriggers.TASK_RUNTIME_CHANGE]: {
    trigger: TriggerType.RUNTIME_CHANGE,
    label: "This task succeeds and its runtime changes by some percentage",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Percent change",
        fieldType: "input",
        key: ExtraFieldKey.TASK_PERCENT_CHANGE,
        dataCy: "percent-change-input",
        format: "validPercentage",
        default: "10",
      },
    ],
  },
};

// PATCH TRIGGERS
export const patchTriggers: Trigger = {
  [VersionTriggers.VERSION_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    label: "This version finishes",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
  },
  [VersionTriggers.VERSION_FAILS]: {
    trigger: TriggerType.FAILURE,
    label: "This version fails",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
  },
  [VersionTriggers.VERSION_SUCCEEDS]: {
    trigger: TriggerType.SUCCESS,
    label: "This version succeeds",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
  },
  [VersionTriggers.VERSION_EXCEEDS_DURATION]: {
    trigger: TriggerType.EXCEEDS_DURATION,
    label: "The runtime for this version exceeds some duration",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Version duration (seconds)",
        fieldType: "input",
        key: ExtraFieldKey.VERSION_DURATION_SECS,
        dataCy: "duration-secs-input",
        format: "validDuration",
        default: "10",
      },
    ],
  },
  [VersionTriggers.VERSION_RUNTIME_CHANGE]: {
    trigger: TriggerType.RUNTIME_CHANGE,
    label: "The runtime for this version changes by some percentage",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Percent change",
        fieldType: "input",
        key: ExtraFieldKey.VERSION_PERCENT_CHANGE,
        dataCy: "percent-change-input",
        format: "validPercentage",
        default: "10",
      },
    ],
  },
  [VersionTriggers.BUILD_VARIANT_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.BUILD,
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version finishes",
    regexSelectors: buildRegexSelectors,
  },
  [VersionTriggers.BUILD_VARIANT_FAILS]: {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.BUILD,
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version fails",
    regexSelectors: buildRegexSelectors,
  },
  [VersionTriggers.BUILD_VARIANT_SUCCEEDS]: {
    trigger: TriggerType.SUCCESS,
    resourceType: ResourceType.BUILD,
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version succeeds",
    regexSelectors: buildRegexSelectors,
  },
};

export const projectTriggers: Trigger = {
  [ProjectTriggers.ANY_VERSION_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.VERSION,
    label: "Any Version Finishes",
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_VERSION_FAILS]: {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.VERSION,
    label: "Any Version Fails",
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_BUILD_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.BUILD,
    label: "Any Build Finishes",
    regexSelectors: buildRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_BUILD_FAILS]: {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.BUILD,
    label: "Any Build Fails",
    regexSelectors: buildRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_TASK_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.TASK,
    label: "Any Task Finishes",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_TASK_FAILS]: {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.TASK,
    label: "Any Task Fails",
    regexSelectors: taskRegexSelectors,
    extraFields: [failureTypeSubscriberConfig, requesterSubscriberConfig],
  },
  [ProjectTriggers.FIRST_FAILURE_VERSION]: {
    trigger: TriggerType.FIRST_FAILURE_VERSION,
    resourceType: ResourceType.TASK,
    label: "The First Failure In a Version Occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.FIRST_FAILURE_BUILD]: {
    trigger: TriggerType.FIRST_FAILURE_BUILD,
    resourceType: ResourceType.TASK,
    label: "The First Failure In Each Build Occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.FIRST_FAILURE_TASK]: {
    trigger: TriggerType.FIRST_FAILURE_VERSION_NAME,
    resourceType: ResourceType.TASK,
    label: "The First Failure In Each Version For Each Task Name Occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.PREVIOUS_PASSING_TASK_FAILS]: {
    trigger: TriggerType.REGRESSION,
    resourceType: ResourceType.TASK,
    label: "A Previously Passing Task Fails",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Re-Notify After How Many Hours",
        fieldType: "input",
        key: ExtraFieldKey.RENOTIFY_INTERVAL,
        format: "validDuration",
        default: RenotifyDefaultTime,
      },
      failureTypeSubscriberConfig,
    ],
  },
  [ProjectTriggers.PREVIOUS_PASSING_TEST_FAILS]: {
    trigger: TriggerType.TEST_REGRESSION,
    resourceType: ResourceType.TASK,
    label: "A Previously Passing Test In a Task Fails",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Test Names Matching Regex",
        fieldType: "input",
        key: ExtraFieldKey.TEST_REGEX,
        format: "validRegex",
        default: "",
      },
      {
        text: "Re-Notify After How Many Hours",
        fieldType: "input",
        key: ExtraFieldKey.RENOTIFY_INTERVAL,
        format: "validDuration",
        default: RenotifyDefaultTime,
      },
      failureTypeSubscriberConfig,
    ],
  },
  [ProjectTriggers.TASK_EXCEEDS_DURATION]: {
    trigger: TriggerType.EXCEEDS_DURATION,
    resourceType: ResourceType.TASK,
    label: "The Runtime For a Task Exceeds Some Duration",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Task Duration (Seconds)",
        fieldType: "input",
        key: ExtraFieldKey.TASK_DURATION_SECS,
        format: "validDuration",
        default: "10",
      },
    ],
  },
  [ProjectTriggers.SUCCESSFUL_TASK_RUNTIME_CHANGES]: {
    trigger: TriggerType.RUNTIME_CHANGE,
    resourceType: ResourceType.TASK,
    label: "The Runtime For a Successful Task Changes By Some Percentage",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Percent Change",
        fieldType: "input",
        key: ExtraFieldKey.TASK_PERCENT_CHANGE,
        format: "validPercentage",
        default: "10",
      },
    ],
  },
  [ProjectTriggers.VERSION_EXCEEDS_DURATION]: {
    trigger: TriggerType.EXCEEDS_DURATION,
    label: "The Runtime For This Version Exceeds Some Duration",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Version duration (seconds)",
        fieldType: "input",
        key: ExtraFieldKey.VERSION_DURATION_SECS,
        dataCy: "duration-secs-input",
        format: "validDuration",
        default: "10",
      },
    ],
  },
  [ProjectTriggers.VERSION_RUNTIME_CHANGE]: {
    trigger: TriggerType.RUNTIME_CHANGE,
    label: "The Runtime For This Version Changes By Some Percentage",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Percent Change",
        fieldType: "input",
        key: ExtraFieldKey.VERSION_PERCENT_CHANGE,
        dataCy: "percent-change-input",
        format: "validPercentage",
        default: "10",
      },
    ],
  },
};
