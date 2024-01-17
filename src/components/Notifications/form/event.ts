import { SpruceFormProps } from "components/SpruceForm/types";
import {
  buildRegexSelectors,
  failureTypeSubscriberOptions,
  requesterSubscriberOptions,
  taskRegexSelectors,
  regexBuildVariant,
  regexDisplayName,
} from "constants/triggers";
import {
  ExtraFieldKey,
  RegexSelector,
  Trigger,
  TaskTriggers,
  VersionTriggers,
  ProjectTriggers,
} from "types/triggers";
import { RegexSelectorRow } from "./RegexSelectorRow";

const percentChangeInput = {
  type: "number" as "number",
  title: "Percent Change",
  minimum: 0,
  default: 10,
};

const taskDurationInput = {
  type: "number" as "number",
  title: "Task Duration (seconds)",
  minimum: 0,
  default: 10,
};

const versionDurationInput = {
  type: "number" as "number",
  title: "Version Duration (seconds)",
  minimum: 0,
  default: 10,
};

const renotifyInput = {
  type: "number" as "number",
  title: "Re-Notify After How Many Hours",
  minimum: 0,
  default: 48,
};

const testNameRegexInput = {
  type: "string" as "string",
  title: "Test Names Matching Regex",
  format: "validRegex",
  default: "",
};

const buildSelect = {
  type: "string" as "string",
  title: "Build Initiator",
  default: "gitter_request",
  oneOf: [
    ...Object.keys(requesterSubscriberOptions).map((r) => ({
      type: "string" as "string",
      title: requesterSubscriberOptions[r],
      enum: [r],
    })),
  ],
};

const failureSelect = {
  type: "string" as "string",
  title: "Failure Type",
  default: "any",
  oneOf: [
    ...Object.keys(failureTypeSubscriberOptions).map((f) => ({
      type: "string" as "string",
      title: failureTypeSubscriberOptions[f],
      enum: [f],
    })),
  ],
};

const regexSelector = (
  regexEnumsToDisable: string[],
  regexSelectors: RegexSelector[],
) => ({
  type: "array" as "array",
  minItems: 0,
  maxItems: 2,
  items: {
    type: "object" as "object",
    required: ["regexSelect", "regexInput"],
    properties: {
      regexSelect: {
        type: "string" as "string",
        title: "Field name",
        default: regexEnumsToDisable.includes(regexBuildVariant)
          ? regexDisplayName
          : regexBuildVariant,
        oneOf: [
          ...regexSelectors.map((r) => ({
            type: "string" as "string",
            title: r.typeLabel,
            enum: [r.type],
          })),
        ],
      },
      regexInput: {
        type: "string" as "string",
        title: "Regex",
        format: "validRegex",
        minLength: 1,
      },
    },
  },
});

/**
 * getEventSchema returns the schema and uiSchema for the event section of subscriptions.
 * @param regexEnumsToDisable - enums that should not be selectable in the regex selector. Only allow one of each
 * (build-variant, display-name) to be selected
 * @param triggers - an object containing information about available triggers. The available triggers differ between task,
 * version, and project subscriptions
 * @returns schema and uiSchema for the event section of subscriptions
 */
export const getEventSchema = (
  regexEnumsToDisable: string[],
  triggers: Trigger,
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  schema: {
    type: "object" as "object",
    title: "Choose an Event",
    required: ["eventSelect"],
    properties: {
      eventSelect: {
        type: "string" as "string",
        title: "Event",
        default: "",
        oneOf: [
          ...Object.keys(triggers).map((t) => ({
            type: "string" as "string",
            title: triggers[t].label,
            enum: [t],
          })),
        ],
      },
    },
    dependencies: {
      eventSelect: {
        oneOf: [
          {
            properties: {
              eventSelect: {
                enum: [
                  TaskTriggers.TASK_STARTS,
                  TaskTriggers.TASK_FINISHES,
                  TaskTriggers.TASK_FAILS,
                  TaskTriggers.TASK_FAILS_OR_BLOCKED,
                  TaskTriggers.TASK_SUCCEEDS,
                  VersionTriggers.VERSION_FINISHES,
                  VersionTriggers.VERSION_FAILS,
                  VersionTriggers.VERSION_SUCCEEDS,
                ],
              },
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [TaskTriggers.TASK_RUNTIME_CHANGE],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                required: [ExtraFieldKey.TASK_PERCENT_CHANGE],
                properties: {
                  [ExtraFieldKey.TASK_PERCENT_CHANGE]: percentChangeInput,
                },
              },
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [VersionTriggers.VERSION_RUNTIME_CHANGE],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                required: [ExtraFieldKey.VERSION_PERCENT_CHANGE],
                properties: {
                  [ExtraFieldKey.VERSION_PERCENT_CHANGE]: percentChangeInput,
                },
              },
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [TaskTriggers.TASK_EXCEEDS_DURATION],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                required: [ExtraFieldKey.TASK_DURATION_SECS],
                properties: {
                  [ExtraFieldKey.TASK_DURATION_SECS]: taskDurationInput,
                },
              },
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [VersionTriggers.VERSION_EXCEEDS_DURATION],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                required: [ExtraFieldKey.VERSION_DURATION_SECS],
                properties: {
                  [ExtraFieldKey.VERSION_DURATION_SECS]: versionDurationInput,
                },
              },
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [
                  VersionTriggers.BUILD_VARIANT_FINISHES,
                  VersionTriggers.BUILD_VARIANT_FAILS,
                  VersionTriggers.BUILD_VARIANT_SUCCEEDS,
                ],
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                buildRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [
                  ProjectTriggers.ANY_VERSION_FINISHES,
                  ProjectTriggers.ANY_VERSION_FAILS,
                  ProjectTriggers.ANY_VERSION_SUCCEEDS,
                ],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                required: [ExtraFieldKey.BUILD_INITIATOR],
                properties: {
                  [ExtraFieldKey.BUILD_INITIATOR]: buildSelect,
                },
              },
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [
                  ProjectTriggers.ANY_BUILD_FINISHES,
                  ProjectTriggers.ANY_BUILD_FAILS,
                  ProjectTriggers.ANY_BUILD_SUCCEEDS,
                ],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                required: [ExtraFieldKey.BUILD_INITIATOR],
                properties: {
                  [ExtraFieldKey.BUILD_INITIATOR]: buildSelect,
                },
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                buildRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [
                  ProjectTriggers.ANY_TASK_FINISHES,
                  ProjectTriggers.FIRST_FAILURE_VERSION,
                  ProjectTriggers.FIRST_FAILURE_BUILD,
                  ProjectTriggers.FIRST_FAILURE_TASK,
                ],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                required: [ExtraFieldKey.BUILD_INITIATOR],
                properties: {
                  [ExtraFieldKey.BUILD_INITIATOR]: buildSelect,
                },
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [ProjectTriggers.ANY_TASK_FAILS],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                required: [
                  ExtraFieldKey.FAILURE_TYPE,
                  ExtraFieldKey.BUILD_INITIATOR,
                ],
                properties: {
                  [ExtraFieldKey.FAILURE_TYPE]: failureSelect,
                  [ExtraFieldKey.BUILD_INITIATOR]: buildSelect,
                },
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [ProjectTriggers.PREVIOUS_PASSING_TASK_FAILS],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                required: [
                  ExtraFieldKey.RENOTIFY_INTERVAL,
                  ExtraFieldKey.FAILURE_TYPE,
                ],
                properties: {
                  [ExtraFieldKey.RENOTIFY_INTERVAL]: renotifyInput,
                  [ExtraFieldKey.FAILURE_TYPE]: failureSelect,
                },
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [ProjectTriggers.PREVIOUS_PASSING_TEST_FAILS],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                required: [
                  ExtraFieldKey.TEST_REGEX,
                  ExtraFieldKey.RENOTIFY_INTERVAL,
                  ExtraFieldKey.FAILURE_TYPE,
                ],
                properties: {
                  [ExtraFieldKey.TEST_REGEX]: testNameRegexInput,
                  [ExtraFieldKey.RENOTIFY_INTERVAL]: renotifyInput,
                  [ExtraFieldKey.FAILURE_TYPE]: failureSelect,
                },
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [
                  ProjectTriggers.TASK_EXCEEDS_DURATION,
                  ProjectTriggers.SUCCESSFUL_TASK_EXCEEDS_DURATION,
                ],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                required: [ExtraFieldKey.TASK_DURATION_SECS],
                properties: {
                  [ExtraFieldKey.TASK_DURATION_SECS]: taskDurationInput,
                },
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [ProjectTriggers.SUCCESSFUL_TASK_RUNTIME_CHANGES],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                required: [ExtraFieldKey.TASK_PERCENT_CHANGE],
                properties: {
                  [ExtraFieldKey.TASK_PERCENT_CHANGE]: percentChangeInput,
                },
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors,
              ),
            },
          },
        ],
      },
    },
  },
  uiSchema: {
    eventSelect: {
      "ui:data-cy": "event-trigger-select",
      "ui:allowDeselect": false,
    },
    extraFields: {
      "ui:showLabel": false,
      [ExtraFieldKey.TASK_PERCENT_CHANGE]: {
        "ui:data-cy": "percent-change-input",
      },
      [ExtraFieldKey.VERSION_PERCENT_CHANGE]: {
        "ui:data-cy": "percent-change-input",
      },
      [ExtraFieldKey.TASK_DURATION_SECS]: {
        "ui:data-cy": "duration-secs-input",
      },
      [ExtraFieldKey.VERSION_DURATION_SECS]: {
        "ui:data-cy": "duration-secs-input",
      },
      [ExtraFieldKey.RENOTIFY_INTERVAL]: {
        "ui:data-cy": "renotify-interval-input",
      },
      [ExtraFieldKey.TEST_REGEX]: {
        "ui:data-cy": "test-regex-input",
      },
      [ExtraFieldKey.BUILD_INITIATOR]: {
        "ui:data-cy": "build-initiator-select",
        "ui:allowDeselect": false,
      },
      [ExtraFieldKey.FAILURE_TYPE]: {
        "ui:data-cy": "failure-type-select",
        "ui:allowDeselect": false,
      },
    },
    regexSelector: {
      "ui:showLabel": false,
      "ui:description":
        "Regex can be specified for at most one name and one ID.",
      "ui:orderable": false,
      "ui:addToEnd": true,
      "ui:addButtonText": "Add Additional Criteria",
      items: {
        "ui:ObjectFieldTemplate": RegexSelectorRow,
        "ui:label": false,
        regexSelect: {
          "ui:data-cy": "regex-select",
          "ui:enumDisabled": regexEnumsToDisable,
          "ui:allowDeselect": false,
        },
        regexInput: {
          "ui:data-cy": "regex-input",
        },
      },
    },
  },
});
