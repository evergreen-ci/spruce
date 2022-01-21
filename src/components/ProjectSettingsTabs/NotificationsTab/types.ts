import {
  buildRegexSelectors,
  taskRegexSelectors,
  requesterSubscriberConfig,
  ResourceType,
  Trigger,
  failureTypeSubscriberConfig,
} from "constants/triggers";
import { validateDuration, validatePercentage } from "utils/validators";

export const triggers: Trigger[] = [
  {
    trigger: "outcome",
    resourceType: ResourceType.VERSION,
    label: "Any version finishes",
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: "failure",
    resourceType: ResourceType.VERSION,
    label: "Any version fails",
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: "outcome",
    resourceType: ResourceType.BUILD,
    label: "Any build finishes",
    regexSelectors: buildRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: "failure",
    resourceType: ResourceType.BUILD,
    label: "Any build fails",
    regexSelectors: buildRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: "outcome",
    resourceType: ResourceType.TASK,
    label: "any task finishes",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: "failure",
    resourceType: ResourceType.TASK,
    label: "any task fails",
    regexSelectors: taskRegexSelectors,
    extraFields: [failureTypeSubscriberConfig, requesterSubscriberConfig],
  },
  {
    trigger: "first-failure-in-version",
    resourceType: ResourceType.TASK,
    label: "the first failure in a version occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: "first-failure-in-build",
    resourceType: ResourceType.TASK,
    label: "the first failure in each build occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: "first-failure-in-version-with-name",
    resourceType: ResourceType.TASK,
    label: "the first failure in each version for each task name occurs",
    regexSelectors: taskRegexSelectors,
    extraFields: [requesterSubscriberConfig],
  },
  {
    trigger: "regression",
    resourceType: ResourceType.TASK,
    label: "a previously passing task fails",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Re-notify after how many hours",
        key: "renotify-interval",
        validator: validateDuration,
        default: "48",
      },
      failureTypeSubscriberConfig,
    ],
  },
  {
    trigger: "regression-by-test",
    resourceType: ResourceType.TASK,
    label: "a previously passing test in a task fails",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Test names matching regex",
        key: "test-regex",
        validator: null,
      },
      {
        text: "Re-notify after how many hours",
        key: "renotify-interval",
        validator: validateDuration,
        default: "48",
      },
      failureTypeSubscriberConfig,
    ],
  },
  {
    trigger: "exceeds-duration",
    resourceType: ResourceType.TASK,
    label: "the runtime for a task exceeds some duration",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Task duration (seconds)",
        key: "task-duration-secs",
        validator: validateDuration,
      },
    ],
  },
  {
    trigger: "runtime-change",
    resourceType: ResourceType.TASK,
    label: "the runtime for a successful task changes by some percentage",
    regexSelectors: taskRegexSelectors,
    extraFields: [
      {
        text: "Percent change",
        key: "task-percent-change",
        validator: validatePercentage,
      },
    ],
  },
  {
    trigger: "exceeds-duration",
    label: "The runtime for this version exceeds some duration",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Version duration (seconds)",
        key: "version-duration-secs",
        dataCy: "duration-secs-input",
        validator: validateDuration,
      },
    ],
  },
  {
    trigger: "runtime-change",
    label: "The runtime for this version changes by some percentage",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Percent change",
        key: "version-percent-change",
        dataCy: "percent-change-input",
        validator: validatePercentage,
      },
    ],
  },
];
