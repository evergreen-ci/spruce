import { SubscriptionMethods } from "hooks/useNotificationModal";
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
} from "types/triggers";
import {
  validateDuration,
  validatePercentage,
  validateJira,
  validateEmail,
  validateSlack,
} from "utils/validators";

export const subscriptionMethodControls: SubscriptionMethods = {
  "jira-comment": {
    label: "JIRA Issue",
    placeholder: "ABC-123",
    targetPath: "jira-comment",
    validator: validateJira,
  },
  email: {
    label: "Email Address",
    placeholder: "someone@example.com",
    targetPath: "email",
    validator: validateEmail,
  },
  slack: {
    label: "Slack Username or Channel",
    placeholder: "@user",
    targetPath: "slack",
    validator: validateSlack,
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

const failureTypeSubscriberOptions: string[] = [
  "Any", // default
  "Test",
  "System",
  "Setup",
];

export const failureTypeSubscriberConfig = {
  text: "Failure Type",
  key: "failure-type",
  type: "select",
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
  type: "select",
  options: Object.values(requesterSubscriberOptions),
};

export const clearExtraFieldsInputCb = (accum: StringMap, eF: ExtraField) => ({
  ...accum,
  [eF.key]: "10",
});

export const triggers: Trigger[] = [
  {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.VERSION,
    label: "Any Version Finishes",
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.VERSION,
    label: "Any Version Fails",
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.BUILD,
    label: "Any Build Finishes",
    regexSelectors: buildRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.BUILD,
    label: "Any Build Fails",
    regexSelectors: buildRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.TASK,
    label: "Any Task Finishes",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.TASK,
    label: "Any Task Fails",
    regexSelectors: taskRegexSelectors,
    extraFields: [failureTypeSubscriberConfig, requesterSubscriberConfig],
  },
  {
    trigger: TriggerType.FIRST_FAILURE_VERSION,
    resourceType: ResourceType.TASK,
    label: "The First Failure In a Version Occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: TriggerType.FIRST_FAILURE_BUILD,
    resourceType: ResourceType.TASK,
    label: "The First Failure In Each Build Occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: TriggerType.FIRST_FAILURE_VERSION_NAME,
    resourceType: ResourceType.TASK,
    label: "The First Failure In Each Version For Each Task Name Occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: TriggerType.REGRESSION,
    resourceType: ResourceType.TASK,
    label: "A Previously Passing Task Fails",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Re-Notify After How Many Hours",
        key: ExtraFieldKey.RENOTIFY_INTERVAL,
        validator: validateDuration,
        default: RenotifyDefaultTime,
      },
      failureTypeSubscriberConfig,
    ],
  },
  {
    trigger: TriggerType.TEST_REGRESSION,
    resourceType: ResourceType.TASK,
    label: "A Previously Passing Test In a Task Fails",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Test Names Matching Regex",
        key: ExtraFieldKey.TEST_REGEX,
        validator: null,
      },
      {
        text: "Re-Notify After How Many Hours",
        key: ExtraFieldKey.RENOTIFY_INTERVAL,
        validator: validateDuration,
        default: RenotifyDefaultTime,
      },
      failureTypeSubscriberConfig,
    ],
  },
  {
    trigger: TriggerType.EXCEEDS_DURATION,
    resourceType: ResourceType.TASK,
    label: "The Runtime For a Task Exceeds Some Duration",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Task Duration (Seconds)",
        key: ExtraFieldKey.TASK_DURATION_SECS,
        validator: validateDuration,
      },
    ],
  },
  {
    trigger: TriggerType.RUNTIME_CHANGE,
    resourceType: ResourceType.TASK,
    label: "The Runtime For a Successful Task Changes By Some Percentage",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Percent Change",
        key: ExtraFieldKey.TASK_PERCENT_CHANGE,
        validator: validatePercentage,
      },
    ],
  },
  {
    trigger: TriggerType.EXCEEDS_DURATION,
    label: "The Runtime For This Version Exceeds Some Duration",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Version duration (seconds)",
        key: ExtraFieldKey.VERSION_DURATION_SECS,
        dataCy: "duration-secs-input",
        validator: validateDuration,
      },
    ],
  },
  {
    trigger: TriggerType.RUNTIME_CHANGE,
    label: "The Runtime For This Version Changes By Some Percentage",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Percent Change",
        key: ExtraFieldKey.VERSION_PERCENT_CHANGE,
        dataCy: "percent-change-input",
        validator: validatePercentage,
      },
    ],
  },
];
