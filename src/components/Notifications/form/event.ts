import { SpruceFormProps } from "components/SpruceForm";
import { AntdSelect } from "components/SpruceForm/Widgets/AntdWidgets";
import {
  buildRegexSelectors,
  failureTypeSubscriberOptions,
  requesterSubscriberOptions,
  taskRegexSelectors,
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
  type: "string" as "string",
  title: "Percent Change",
  format: "validPercentage",
  default: "10",
};

const taskDurationInput = {
  type: "string" as "string",
  title: "Task Duration (seconds)",
  format: "validDuration",
  default: "10",
};

const versionDurationInput = {
  type: "string" as "string",
  title: "Version Duration (seconds)",
  format: "validDuration",
  default: "10",
};

const renotifyInput = {
  type: "string" as "string",
  title: "Re-Notify After How Many Hours",
  format: "validDuration",
  default: "48",
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
  regexSelectors: RegexSelector[]
) => ({
  type: "array" as "array",
  minItems: 0,
  maxItems: 2,
  required: ["regexSelect", "regexInput"],
  items: {
    type: "object" as "object",
    properties: {
      regexSelect: {
        type: "string" as "string",
        title: "Field name",
        default: regexEnumsToDisable.includes("build-variant")
          ? "display-name"
          : "build-variant",
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
        default: "",
        minLength: 1,
      },
    },
  },
});

/**
 * getEventSchema returns the schema and uiSchema for the event section of subscriptions.
 *
 * @param regexEnumsToDisable - enums that should not be selectable in the regex selector. Only allow one of each
 * (build-variant, display-name) to be selected
 * @param triggers - an object containing information about available triggers. The available triggers differ between task,
 * version, and project subscriptions
 */
export const getEventSchema = (
  regexEnumsToDisable: string[],
  triggers: Trigger
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  schema: {
    type: "object" as "object",
    title: "Choose an Event",
    properties: {
      eventSelect: {
        type: "string" as "string",
        title: "Event",
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
                buildRegexSelectors
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [
                  ProjectTriggers.ANY_VERSION_FINISHES,
                  ProjectTriggers.ANY_VERSION_FAILS,
                ],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
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
                ],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                properties: {
                  [ExtraFieldKey.BUILD_INITIATOR]: buildSelect,
                },
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                buildRegexSelectors
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
                properties: {
                  [ExtraFieldKey.BUILD_INITIATOR]: buildSelect,
                },
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors
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
                properties: {
                  [ExtraFieldKey.FAILURE_TYPE]: failureSelect,
                  [ExtraFieldKey.BUILD_INITIATOR]: buildSelect,
                },
              },
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
                properties: {
                  [ExtraFieldKey.RENOTIFY_INTERVAL]: renotifyInput,
                  [ExtraFieldKey.FAILURE_TYPE]: failureSelect,
                },
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors
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
                properties: {
                  [ExtraFieldKey.TEST_REGEX]: testNameRegexInput,
                  [ExtraFieldKey.RENOTIFY_INTERVAL]: renotifyInput,
                  [ExtraFieldKey.FAILURE_TYPE]: failureSelect,
                },
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [ProjectTriggers.TASK_EXCEEDS_DURATION],
              },
              extraFields: {
                type: "object" as "object",
                title: "",
                properties: {
                  [ExtraFieldKey.TASK_DURATION_SECS]: taskDurationInput,
                },
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors
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
                properties: {
                  [ExtraFieldKey.TASK_PERCENT_CHANGE]: percentChangeInput,
                },
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors
              ),
            },
          },
        ],
      },
    },
  },
  uiSchema: {
    eventSelect: {
      "ui:widget": AntdSelect,
      "ui:data-cy": "event-trigger-select",
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
        "ui:widget": AntdSelect,
        "ui:data-cy": "build-initiator-select",
      },
      [ExtraFieldKey.FAILURE_TYPE]: {
        "ui:widget": AntdSelect,
        "ui:data-cy": "failure-type-select",
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
        regexSelect: {
          "ui:widget": AntdSelect,
          "ui:data-cy": "regex-select",
          "ui:disabledEnums": regexEnumsToDisable,
        },
        regexInput: {
          "ui:data-cy": "regex-input",
        },
      },
    },
  },
});
