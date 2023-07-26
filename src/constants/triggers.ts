import { TreeDataEntry } from "components/TreeSelect";
import { NotificationMethods } from "types/subscription";
import {
  ExtraField,
  ExtraFieldKey,
  RegexSelector,
  ResourceType,
  Trigger,
  TriggerType,
  TaskTriggers,
  VersionTriggers,
  ProjectTriggers,
} from "types/triggers";

export const renotifyDefaultTime = "48";
export const regexDisplayName = "display-name";
export const regexBuildVariant = "build-variant";

export const buildRegexSelectors: RegexSelector[] = [
  {
    type: regexDisplayName,
    typeLabel: "Build Variant Name",
  },
  {
    type: regexBuildVariant,
    typeLabel: "Build Variant ID",
  },
];

export const taskRegexSelectors: RegexSelector[] = [
  {
    type: regexDisplayName,
    typeLabel: "Task Name",
  },
  {
    type: regexBuildVariant,
    typeLabel: "Build Variant Name",
  },
];

export const failureTypeSubscriberOptions = {
  any: "Any",
  setup: "Setup",
  system: "System",
  test: "Test",
};

export const failureTypeSubscriberConfig: ExtraField = {
  default: "any",
  fieldType: "select",
  key: ExtraFieldKey.FAILURE_TYPE,
  options: failureTypeSubscriberOptions,
  text: "Failure Type",
};

export const requesterSubscriberOptions = {
  ad_hoc: "Periodic Build",
  github_pull_request: "Pull Request",
  gitter_request: "Commit",
  merge_test: "Commit Queue",
  patch_request: "Patch",
};

export const requesterSubscriberConfig: ExtraField = {
  default: "gitter_request",
  fieldType: "select",
  key: ExtraFieldKey.BUILD_INITIATOR,
  options: requesterSubscriberOptions,
  text: "Build Initiator",
};

export const taskTriggers: Trigger = {
  [TaskTriggers.TASK_STARTS]: {
    label: "This task starts",
    payloadResourceIdKey: "id",
    resourceType: ResourceType.Task,
    trigger: TriggerType.TASK_STARTED,
  },
  [TaskTriggers.TASK_FINISHES]: {
    label: "This task finishes",
    payloadResourceIdKey: "id",
    resourceType: ResourceType.Task,
    trigger: TriggerType.OUTCOME,
  },
  [TaskTriggers.TASK_FAILS]: {
    label: "This task fails",
    payloadResourceIdKey: "id",
    resourceType: ResourceType.Task,
    trigger: TriggerType.FAILURE,
  },
  [TaskTriggers.TASK_FAILS_OR_BLOCKED]: {
    label: "This task fails or is blocked",
    payloadResourceIdKey: "id",
    resourceType: ResourceType.Task,
    trigger: TriggerType.TASK_FAILED_OR_BLOCKED,
  },
  [TaskTriggers.TASK_SUCCEEDS]: {
    label: "This task succeeds",
    payloadResourceIdKey: "id",
    resourceType: ResourceType.Task,
    trigger: TriggerType.SUCCESS,
  },
  [TaskTriggers.TASK_EXCEEDS_DURATION]: {
    extraFields: [
      {
        default: "10",
        fieldType: "input",
        format: "number",
        key: ExtraFieldKey.TASK_DURATION_SECS,
        text: "Task duration (seconds)",
      },
    ],
    label: "The runtime for this task exceeds some duration",
    payloadResourceIdKey: "id",
    resourceType: ResourceType.Task,
    trigger: TriggerType.EXCEEDS_DURATION,
  },
  [TaskTriggers.TASK_RUNTIME_CHANGE]: {
    extraFields: [
      {
        default: "10",
        fieldType: "input",
        format: "number",
        key: ExtraFieldKey.TASK_PERCENT_CHANGE,
        text: "Percent change",
      },
    ],
    label: "This task succeeds and its runtime changes by some percentage",
    payloadResourceIdKey: "id",
    resourceType: ResourceType.Task,
    trigger: TriggerType.RUNTIME_CHANGE,
  },
};

// VERSION TRIGGERS
export const versionTriggers: Trigger = {
  [VersionTriggers.VERSION_FINISHES]: {
    label: "This version finishes",
    payloadResourceIdKey: "id",
    resourceType: ResourceType.Version,
    trigger: TriggerType.FAMILY_OUTCOME,
  },
  [VersionTriggers.VERSION_FAILS]: {
    label: "This version fails",
    payloadResourceIdKey: "id",
    resourceType: ResourceType.Version,
    trigger: TriggerType.FAMILY_FAILURE,
  },
  [VersionTriggers.VERSION_SUCCEEDS]: {
    label: "This version succeeds",
    payloadResourceIdKey: "id",
    resourceType: ResourceType.Version,
    trigger: TriggerType.FAMILY_SUCCESS,
  },
  [VersionTriggers.VERSION_EXCEEDS_DURATION]: {
    extraFields: [
      {
        default: "10",
        fieldType: "input",
        format: "number",
        key: ExtraFieldKey.VERSION_DURATION_SECS,
        text: "Version duration (seconds)",
      },
    ],
    label: "The runtime for this version exceeds some duration",
    payloadResourceIdKey: "id",
    resourceType: ResourceType.Version,
    trigger: TriggerType.EXCEEDS_DURATION,
  },
  [VersionTriggers.VERSION_RUNTIME_CHANGE]: {
    extraFields: [
      {
        default: "10",
        fieldType: "input",
        format: "number",
        key: ExtraFieldKey.VERSION_PERCENT_CHANGE,
        text: "Percent change",
      },
    ],
    label: "The runtime for this version changes by some percentage",
    payloadResourceIdKey: "id",
    resourceType: ResourceType.Version,
    trigger: TriggerType.RUNTIME_CHANGE,
  },
  [VersionTriggers.BUILD_VARIANT_FINISHES]: {
    label: "A build-variant in this version finishes",
    payloadResourceIdKey: "in-version",
    regexSelectors: buildRegexSelectors,
    resourceType: ResourceType.Build,
    trigger: TriggerType.OUTCOME,
  },
  [VersionTriggers.BUILD_VARIANT_FAILS]: {
    label: "A build-variant in this version fails",
    payloadResourceIdKey: "in-version",
    regexSelectors: buildRegexSelectors,
    resourceType: ResourceType.Build,
    trigger: TriggerType.FAILURE,
  },
  [VersionTriggers.BUILD_VARIANT_SUCCEEDS]: {
    label: "A build-variant in this version succeeds",
    payloadResourceIdKey: "in-version",
    regexSelectors: buildRegexSelectors,
    resourceType: ResourceType.Build,
    trigger: TriggerType.SUCCESS,
  },
};

export const projectTriggers: Trigger = {
  [ProjectTriggers.ANY_VERSION_FINISHES]: {
    extraFields: [requesterSubscriberConfig],
    label: "Any Version Finishes",
    resourceType: ResourceType.Version,
    trigger: TriggerType.FAMILY_OUTCOME,
  },
  [ProjectTriggers.ANY_VERSION_FAILS]: {
    extraFields: [requesterSubscriberConfig],
    label: "Any Version Fails",
    resourceType: ResourceType.Version,
    trigger: TriggerType.FAMILY_FAILURE,
  },
  [ProjectTriggers.ANY_BUILD_FINISHES]: {
    extraFields: [requesterSubscriberConfig],
    label: "Any Build Finishes",
    regexSelectors: buildRegexSelectors,
    resourceType: ResourceType.Build,
    trigger: TriggerType.OUTCOME,
  },
  [ProjectTriggers.ANY_BUILD_FAILS]: {
    extraFields: [requesterSubscriberConfig],
    label: "Any Build Fails",
    regexSelectors: buildRegexSelectors,
    resourceType: ResourceType.Build,
    trigger: TriggerType.FAILURE,
  },
  [ProjectTriggers.ANY_TASK_FINISHES]: {
    extraFields: [requesterSubscriberConfig],
    label: "Any Task Finishes",
    regexSelectors: taskRegexSelectors,
    resourceType: ResourceType.Task,
    trigger: TriggerType.OUTCOME,
  },
  [ProjectTriggers.ANY_TASK_FAILS]: {
    extraFields: [failureTypeSubscriberConfig, requesterSubscriberConfig],
    label: "Any Task Fails",
    regexSelectors: taskRegexSelectors,
    resourceType: ResourceType.Task,
    trigger: TriggerType.FAILURE,
  },
  [ProjectTriggers.FIRST_FAILURE_VERSION]: {
    extraFields: [requesterSubscriberConfig],
    label: "The First Failure In a Version Occurs",
    regexSelectors: taskRegexSelectors,
    resourceType: ResourceType.Task,
    trigger: TriggerType.FIRST_FAILURE_VERSION,
  },
  [ProjectTriggers.FIRST_FAILURE_BUILD]: {
    extraFields: [requesterSubscriberConfig],
    label: "The First Failure In Each Build Occurs",
    regexSelectors: taskRegexSelectors,
    resourceType: ResourceType.Task,
    trigger: TriggerType.FIRST_FAILURE_BUILD,
  },
  [ProjectTriggers.FIRST_FAILURE_TASK]: {
    extraFields: [requesterSubscriberConfig],
    label: "The First Failure In Each Version For Each Task Name Occurs",
    regexSelectors: taskRegexSelectors,
    resourceType: ResourceType.Task,
    trigger: TriggerType.FIRST_FAILURE_VERSION_NAME,
  },
  [ProjectTriggers.PREVIOUS_PASSING_TASK_FAILS]: {
    extraFields: [
      {
        default: renotifyDefaultTime,
        fieldType: "input",
        format: "number",
        key: ExtraFieldKey.RENOTIFY_INTERVAL,
        text: "Re-Notify After How Many Hours",
      },
      failureTypeSubscriberConfig,
    ],
    label: "A Previously Passing Task Fails",
    regexSelectors: taskRegexSelectors,
    resourceType: ResourceType.Task,
    trigger: TriggerType.REGRESSION,
  },
  [ProjectTriggers.PREVIOUS_PASSING_TEST_FAILS]: {
    extraFields: [
      {
        default: "",
        fieldType: "input",
        format: "string",
        key: ExtraFieldKey.TEST_REGEX,
        text: "Test Names Matching Regex",
      },
      {
        default: renotifyDefaultTime,
        fieldType: "input",
        format: "number",
        key: ExtraFieldKey.RENOTIFY_INTERVAL,
        text: "Re-Notify After How Many Hours",
      },
      failureTypeSubscriberConfig,
    ],
    label: "A Previously Passing Test In a Task Fails",
    regexSelectors: taskRegexSelectors,
    resourceType: ResourceType.Task,
    trigger: TriggerType.TEST_REGRESSION,
  },
  [ProjectTriggers.TASK_EXCEEDS_DURATION]: {
    extraFields: [
      {
        default: "10",
        fieldType: "input",
        format: "number",
        key: ExtraFieldKey.TASK_DURATION_SECS,
        text: "Task Duration (Seconds)",
      },
    ],
    label: "The Runtime For a Task Exceeds Some Duration",
    regexSelectors: taskRegexSelectors,
    resourceType: ResourceType.Task,
    trigger: TriggerType.EXCEEDS_DURATION,
  },
  [ProjectTriggers.SUCCESSFUL_TASK_RUNTIME_CHANGES]: {
    extraFields: [
      {
        default: "10",
        fieldType: "input",
        format: "number",
        key: ExtraFieldKey.TASK_PERCENT_CHANGE,
        text: "Percent Change",
      },
    ],
    label: "The Runtime For a Successful Task Changes By Some Percentage",
    regexSelectors: taskRegexSelectors,
    resourceType: ResourceType.Task,
    trigger: TriggerType.RUNTIME_CHANGE,
  },
};

export const waterfallTriggers: Trigger = {
  [ProjectTriggers.ANY_VERSION_FINISHES]: {
    extraFields: [requesterSubscriberConfig],
    label: "Any Version Finishes",
    resourceType: ResourceType.Version,
    trigger: TriggerType.FAMILY_OUTCOME,
  },
  [ProjectTriggers.ANY_VERSION_FAILS]: {
    extraFields: [requesterSubscriberConfig],
    label: "Any Version Fails",
    resourceType: ResourceType.Version,
    trigger: TriggerType.FAMILY_FAILURE,
  },
  [ProjectTriggers.ANY_VERSION_SUCCEEDS]: {
    extraFields: [requesterSubscriberConfig],
    label: "Any Version Succeeds",
    resourceType: ResourceType.Version,
    trigger: TriggerType.FAMILY_SUCCESS,
  },
  [ProjectTriggers.ANY_BUILD_FINISHES]: {
    extraFields: [requesterSubscriberConfig],
    label: "Any Build Finishes",
    regexSelectors: buildRegexSelectors,
    resourceType: ResourceType.Build,
    trigger: TriggerType.OUTCOME,
  },
  [ProjectTriggers.ANY_BUILD_FAILS]: {
    extraFields: [requesterSubscriberConfig],
    label: "Any Build Fails",
    regexSelectors: buildRegexSelectors,
    resourceType: ResourceType.Build,
    trigger: TriggerType.FAILURE,
  },
  [ProjectTriggers.ANY_BUILD_SUCCEEDS]: {
    extraFields: [requesterSubscriberConfig],
    label: "Any Build Succeeds",
    regexSelectors: buildRegexSelectors,
    resourceType: ResourceType.Build,
    trigger: TriggerType.SUCCESS,
  },
};

export const invalidProjectTriggerSubscriptionCombinations = {
  [NotificationMethods.JIRA_COMMENT]: [
    ProjectTriggers.FIRST_FAILURE_TASK,
    ProjectTriggers.ANY_TASK_FAILS,
    ProjectTriggers.ANY_TASK_FINISHES,
    ProjectTriggers.PREVIOUS_PASSING_TASK_FAILS,
    ProjectTriggers.PREVIOUS_PASSING_TEST_FAILS,
    ProjectTriggers.SUCCESSFUL_TASK_RUNTIME_CHANGES,
  ],
  [NotificationMethods.JIRA_ISSUE]: [
    ProjectTriggers.FIRST_FAILURE_TASK,
    ProjectTriggers.ANY_TASK_FAILS,
    ProjectTriggers.ANY_TASK_FINISHES,
    ProjectTriggers.PREVIOUS_PASSING_TASK_FAILS,
    ProjectTriggers.PREVIOUS_PASSING_TEST_FAILS,
    ProjectTriggers.SUCCESSFUL_TASK_RUNTIME_CHANGES,
  ],
};

export const triggerToCopy = {
  [TriggerType.OUTCOME]: "Outcome",
  [TriggerType.FAILURE]: "Failure",
  [TriggerType.SUCCESS]: "Success",
  [TriggerType.FAMILY_OUTCOME]: "Outcome",
  [TriggerType.FAMILY_FAILURE]: "Failure",
  [TriggerType.FAMILY_SUCCESS]: "Success",
  [TriggerType.RUNTIME_CHANGE]: "Runtime changes by %",
  [TriggerType.EXCEEDS_DURATION]: "Runtime exceeds duration",
  [TriggerType.TASK_STARTED]: "Task started",
  [TriggerType.TASK_FAILED_OR_BLOCKED]: "Task failed or blocked",
  [TriggerType.REGRESSION]: "Regression",
  [TriggerType.TEST_REGRESSION]: "Test regression",
  [TriggerType.FIRST_FAILURE_BUILD]: "First failure",
  [TriggerType.FIRST_FAILURE_BUILD]: "First failure in build",
  [TriggerType.FIRST_FAILURE_VERSION]: "First failure in version",
  [TriggerType.FIRST_FAILURE_VERSION_NAME]:
    "First failure in version with name",
};

export const convertFamilyTrigger = (trigger: string) => {
  switch (trigger) {
    case TriggerType.FAMILY_OUTCOME:
      return TriggerType.OUTCOME;
    case TriggerType.FAMILY_FAILURE:
      return TriggerType.FAILURE;
    case TriggerType.FAMILY_SUCCESS:
      return TriggerType.SUCCESS;
    default:
      return trigger;
  }
};

export const triggerTreeData: TreeDataEntry[] = Object.entries(
  triggerToCopy
).map(([key, value]) => ({
  key,
  title: value,
  value: key,
}));

export const allowedSelectors = new Set([
  "object",
  "id",
  "project",
  "owner",
  "requester",
  "status",
  "display-name",
  "build-variant",
  "in-version",
  "in-build",
]);

export const resourceTypeToCopy = {
  [ResourceType.Build]: "Build",
  [ResourceType.CommitQueue]: "Commit Queue",
  [ResourceType.Host]: "Host",
  [ResourceType.Patch]: "Patch",
  [ResourceType.Task]: "Task",
  [ResourceType.Version]: "Version",
};

export const resourceTypeTreeData: TreeDataEntry[] = Object.entries(
  resourceTypeToCopy
).map(([key, value]) => ({
  key,
  title: value,
  value: key,
}));
