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
  test: "Test",
  system: "System",
  setup: "Setup",
};

export const failureTypeSubscriberConfig: ExtraField = {
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

export const requesterSubscriberConfig: ExtraField = {
  text: "Build Initiator",
  key: ExtraFieldKey.BUILD_INITIATOR,
  fieldType: "select",
  default: "gitter_request",
  options: requesterSubscriberOptions,
};

export const taskTriggers: Trigger = {
  [TaskTriggers.TASK_STARTS]: {
    trigger: TriggerType.TASK_STARTED,
    label: "This task starts",
    resourceType: ResourceType.Task,
    payloadResourceIdKey: "id",
  },
  [TaskTriggers.TASK_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    label: "This task finishes",
    resourceType: ResourceType.Task,
    payloadResourceIdKey: "id",
  },
  [TaskTriggers.TASK_FAILS]: {
    trigger: TriggerType.FAILURE,
    label: "This task fails",
    resourceType: ResourceType.Task,
    payloadResourceIdKey: "id",
  },
  [TaskTriggers.TASK_FAILS_OR_BLOCKED]: {
    trigger: TriggerType.TASK_FAILED_OR_BLOCKED,
    label: "This task fails or is blocked",
    resourceType: ResourceType.Task,
    payloadResourceIdKey: "id",
  },
  [TaskTriggers.TASK_SUCCEEDS]: {
    trigger: TriggerType.SUCCESS,
    label: "This task succeeds",
    resourceType: ResourceType.Task,
    payloadResourceIdKey: "id",
  },
  [TaskTriggers.TASK_EXCEEDS_DURATION]: {
    trigger: TriggerType.EXCEEDS_DURATION,
    label: "The runtime for this task exceeds some duration",
    resourceType: ResourceType.Task,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Task duration (seconds)",
        fieldType: "input",
        key: ExtraFieldKey.TASK_DURATION_SECS,
        format: "number",
        default: "10",
      },
    ],
  },
  [TaskTriggers.TASK_RUNTIME_CHANGE]: {
    trigger: TriggerType.RUNTIME_CHANGE,
    label: "This task succeeds and its runtime changes by some percentage",
    resourceType: ResourceType.Task,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Percent change",
        fieldType: "input",
        key: ExtraFieldKey.TASK_PERCENT_CHANGE,
        format: "number",
        default: "10",
      },
    ],
  },
};

// VERSION TRIGGERS
export const versionTriggers: Trigger = {
  [VersionTriggers.VERSION_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    label: "This version finishes",
    resourceType: ResourceType.Version,
    payloadResourceIdKey: "id",
  },
  [VersionTriggers.VERSION_FAILS]: {
    trigger: TriggerType.FAILURE,
    label: "This version fails",
    resourceType: ResourceType.Version,
    payloadResourceIdKey: "id",
  },
  [VersionTriggers.VERSION_SUCCEEDS]: {
    trigger: TriggerType.SUCCESS,
    label: "This version succeeds",
    resourceType: ResourceType.Version,
    payloadResourceIdKey: "id",
  },
  [VersionTriggers.VERSION_EXCEEDS_DURATION]: {
    trigger: TriggerType.EXCEEDS_DURATION,
    label: "The runtime for this version exceeds some duration",
    resourceType: ResourceType.Version,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Version duration (seconds)",
        fieldType: "input",
        key: ExtraFieldKey.VERSION_DURATION_SECS,
        format: "number",
        default: "10",
      },
    ],
  },
  [VersionTriggers.VERSION_RUNTIME_CHANGE]: {
    trigger: TriggerType.RUNTIME_CHANGE,
    label: "The runtime for this version changes by some percentage",
    resourceType: ResourceType.Version,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Percent change",
        fieldType: "input",
        key: ExtraFieldKey.VERSION_PERCENT_CHANGE,
        format: "number",
        default: "10",
      },
    ],
  },
  [VersionTriggers.BUILD_VARIANT_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.Build,
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version finishes",
    regexSelectors: buildRegexSelectors,
  },
  [VersionTriggers.BUILD_VARIANT_FAILS]: {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.Build,
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version fails",
    regexSelectors: buildRegexSelectors,
  },
  [VersionTriggers.BUILD_VARIANT_SUCCEEDS]: {
    trigger: TriggerType.SUCCESS,
    resourceType: ResourceType.Build,
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version succeeds",
    regexSelectors: buildRegexSelectors,
  },
};

export const projectTriggers: Trigger = {
  [ProjectTriggers.ANY_VERSION_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.Version,
    label: "Any version finishes",
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_VERSION_FAILS]: {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.Version,
    label: "Any version fails",
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_BUILD_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.Build,
    label: "Any build finishes",
    regexSelectors: buildRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_BUILD_FAILS]: {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.Build,
    label: "Any build fails",
    regexSelectors: buildRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_TASK_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.Task,
    label: "Any task finishes",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_TASK_FAILS]: {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.Task,
    label: "Any task fails",
    regexSelectors: taskRegexSelectors,
    extraFields: [failureTypeSubscriberConfig, requesterSubscriberConfig],
  },
  [ProjectTriggers.FIRST_FAILURE_VERSION]: {
    trigger: TriggerType.FIRST_FAILURE_VERSION,
    resourceType: ResourceType.Task,
    label: "The first failure in a version occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.FIRST_FAILURE_BUILD]: {
    trigger: TriggerType.FIRST_FAILURE_BUILD,
    resourceType: ResourceType.Task,
    label: "The first failure in each build occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.FIRST_FAILURE_TASK]: {
    trigger: TriggerType.FIRST_FAILURE_VERSION_NAME,
    resourceType: ResourceType.Task,
    label: "The first failure in each version for each task name occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.PREVIOUS_PASSING_TASK_FAILS]: {
    trigger: TriggerType.REGRESSION,
    resourceType: ResourceType.Task,
    label: "A previously passing task fails",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Re-Notify After How Many Hours",
        fieldType: "input",
        key: ExtraFieldKey.RENOTIFY_INTERVAL,
        format: "number",
        default: renotifyDefaultTime,
      },
      failureTypeSubscriberConfig,
    ],
  },
  [ProjectTriggers.PREVIOUS_PASSING_TEST_FAILS]: {
    trigger: TriggerType.TEST_REGRESSION,
    resourceType: ResourceType.Task,
    label: "A previously passing test in a task fails",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Test Names Matching Regex",
        fieldType: "input",
        key: ExtraFieldKey.TEST_REGEX,
        format: "string",
        default: "",
      },
      {
        text: "Re-Notify After How Many Hours",
        fieldType: "input",
        key: ExtraFieldKey.RENOTIFY_INTERVAL,
        format: "number",
        default: renotifyDefaultTime,
      },
      failureTypeSubscriberConfig,
    ],
  },
  [ProjectTriggers.SUCCESSFUL_TASK_EXCEEDS_DURATION]: {
    trigger: TriggerType.SUCCESSFUL_EXCEEDS_DURATION,
    resourceType: ResourceType.Task,
    label: "The runtime for a successful task exceeds some duration",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Task Duration (Seconds)",
        fieldType: "input",
        key: ExtraFieldKey.TASK_DURATION_SECS,
        format: "number",
        default: "10",
      },
    ],
  },
  [ProjectTriggers.TASK_EXCEEDS_DURATION]: {
    trigger: TriggerType.EXCEEDS_DURATION,
    resourceType: ResourceType.Task,
    label: "The runtime for any task exceeds some duration",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Task Duration (Seconds)",
        fieldType: "input",
        key: ExtraFieldKey.TASK_DURATION_SECS,
        format: "number",
        default: "10",
      },
    ],
  },
  [ProjectTriggers.SUCCESSFUL_TASK_RUNTIME_CHANGES]: {
    trigger: TriggerType.RUNTIME_CHANGE,
    resourceType: ResourceType.Task,
    label: "The runtime for a successful task changes by some percentage",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Percent Change",
        fieldType: "input",
        key: ExtraFieldKey.TASK_PERCENT_CHANGE,
        format: "number",
        default: "10",
      },
    ],
  },
};

export const waterfallTriggers: Trigger = {
  [ProjectTriggers.ANY_VERSION_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.Version,
    label: "Any version finishes",
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_VERSION_FAILS]: {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.Version,
    label: "Any version fails",
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_VERSION_SUCCEEDS]: {
    trigger: TriggerType.SUCCESS,
    resourceType: ResourceType.Version,
    label: "Any version succeeds",
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_BUILD_FINISHES]: {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.Build,
    label: "Any build finishes",
    regexSelectors: buildRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_BUILD_FAILS]: {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.Build,
    label: "Any build fails",
    regexSelectors: buildRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  [ProjectTriggers.ANY_BUILD_SUCCEEDS]: {
    trigger: TriggerType.SUCCESS,
    resourceType: ResourceType.Build,
    label: "Any build succeeds",
    regexSelectors: buildRegexSelectors,
    extraFields: [requesterSubscriberConfig],
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
  [TriggerType.RUNTIME_CHANGE]: "Runtime changes by %",
  [TriggerType.EXCEEDS_DURATION]: "Runtime exceeds duration",
  [TriggerType.SUCCESSFUL_EXCEEDS_DURATION]: "Runtime exceeds duration",
  [TriggerType.TASK_STARTED]: "Task started",
  [TriggerType.TASK_FAILED_OR_BLOCKED]: "Task failed or blocked",
  [TriggerType.REGRESSION]: "Regression",
  [TriggerType.TEST_REGRESSION]: "Test regression",
  [TriggerType.FIRST_FAILURE_BUILD]: "First failure in build",
  [TriggerType.FIRST_FAILURE_VERSION]: "First failure in version",
  [TriggerType.FIRST_FAILURE_VERSION_NAME]:
    "First failure in version with name",
  [TriggerType.FAMILY_OUTCOME]: "Outcome",
  [TriggerType.FAMILY_FAILURE]: "Failure",
  [TriggerType.FAMILY_SUCCESS]: "Success",
};

/**
 * Converts a family trigger into a non-family trigger.
 * @param trigger - string representing a trigger. It may or may not be a family trigger.
 * @returns string representing a non-family trigger
 */
export const convertFromFamilyTrigger = (trigger: string) => {
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
  triggerToCopy,
).map(([key, value]) => ({
  title: value,
  value: key,
  key,
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
  resourceTypeToCopy,
).map(([key, value]) => ({
  title: value,
  value: key,
  key,
}));
