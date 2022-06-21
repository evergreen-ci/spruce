import {
  SUBSCRIPTION_EMAIL,
  SUBSCRIPTION_JIRA_COMMENT,
  SUBSCRIPTION_SLACK,
} from "types/subscription";
import {
  ExtraField,
  ExtraFieldKey,
  RegexSelector,
  RenotifyDefaultTime,
  ResourceType,
  StringMap,
  Trigger,
  TriggerType,
  SubscriptionMethods,
} from "types/triggers";

export const subscriptionMethodControls: SubscriptionMethods = {
  "jira-comment": {
    dropdown: "Comment on a JIRA issue",
    label: "JIRA Issue",
    placeholder: "ABC-123",
    targetPath: "jira-comment",
    format: "validJiraTicket",
  },
  slack: {
    dropdown: "Slack message",
    label: "Slack Username or Channel",
    placeholder: "@user or #channel",
    targetPath: "slack",
    format: "validSlack",
  },
  email: {
    dropdown: "Email",
    label: "Email Address",
    placeholder: "someone@example.com",
    targetPath: "email",
    format: "validEmail",
  },
};

export const subscriptionMethodDropdownOptions = [
  SUBSCRIPTION_JIRA_COMMENT,
  SUBSCRIPTION_SLACK,
  SUBSCRIPTION_EMAIL,
];

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
  any: "Any", // default
  test: "Test",
  system: "System",
  setup: "Setup",
};

export const failureTypeSubscriberConfig = {
  text: "Failure Type",
  key: "failure-type",
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
  key: "requester",
  fieldType: "select",
  default: "gitter_request",
  options: requesterSubscriberOptions,
};

export const clearExtraFieldsInputCb = (accum: StringMap, eF: ExtraField) => ({
  ...accum,
  [eF.key]: "10",
});

export const taskTriggers: Trigger = {
  "task-starts": {
    trigger: TriggerType.TASK_STARTED,
    label: "This task starts",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  "task-finishes": {
    trigger: TriggerType.OUTCOME,
    label: "This task finishes",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  "task-fails": {
    trigger: TriggerType.FAILURE,
    label: "This task fails",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  "task-fails-or-blocked": {
    trigger: TriggerType.TASK_FAILED_OR_BLOCKED,
    label: "This task fails or is blocked",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  "task-succeeds": {
    trigger: TriggerType.SUCCESS,
    label: "This task succeeds",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  "task-exceeds-duration": {
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
  "task-runtime-change": {
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
  "version-finishes": {
    trigger: TriggerType.OUTCOME,
    label: "This version finishes",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
  },
  "version-fails": {
    trigger: TriggerType.FAILURE,
    label: "This version fails",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
  },
  "version-succeeds": {
    trigger: TriggerType.SUCCESS,
    label: "This version succeeds",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
  },
  "version-exceeds-duration": {
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
  "version-runtime-change": {
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
  "build-variant-finishes": {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.BUILD,
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version finishes",
    regexSelectors: buildRegexSelectors,
  },
  "build-variant-fails": {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.BUILD,
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version fails",
    regexSelectors: buildRegexSelectors,
  },
  "build-variant-succeeds": {
    trigger: TriggerType.SUCCESS,
    resourceType: ResourceType.BUILD,
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version succeeds",
    regexSelectors: buildRegexSelectors,
  },
};

export const projectTriggers: Trigger = {
  "any-version-finishes": {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.VERSION,
    label: "Any Version Finishes",
    extraFields: [requesterSubscriberConfig],
  },
  "any-version-fails": {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.VERSION,
    label: "Any Version Fails",
    extraFields: [requesterSubscriberConfig],
  },
  "any-build-finishes": {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.BUILD,
    label: "Any Build Finishes",
    regexSelectors: buildRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  "any-build-fails": {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.BUILD,
    label: "Any Build Fails",
    regexSelectors: buildRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  "any-task-finishes": {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.TASK,
    label: "Any Task Finishes",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  "any-task-fails": {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.TASK,
    label: "Any Task Fails",
    regexSelectors: taskRegexSelectors,
    extraFields: [failureTypeSubscriberConfig, requesterSubscriberConfig],
  },
  "first-failure-version": {
    trigger: TriggerType.FIRST_FAILURE_VERSION,
    resourceType: ResourceType.TASK,
    label: "The First Failure In a Version Occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  "first-failure-build": {
    trigger: TriggerType.FIRST_FAILURE_BUILD,
    resourceType: ResourceType.TASK,
    label: "The First Failure In Each Build Occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  "first-failure-version-task": {
    trigger: TriggerType.FIRST_FAILURE_VERSION_NAME,
    resourceType: ResourceType.TASK,
    label: "The First Failure In Each Version For Each Task Name Occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  "previous-passing-task-fails": {
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
  "previous-passing-test-fails": {
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
  "task-runtime-exceeds-duration": {
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
  "runtime-successful-task-changes": {
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
  "runtime-version-exceeds-duration": {
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
  "runtime-version-change": {
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
