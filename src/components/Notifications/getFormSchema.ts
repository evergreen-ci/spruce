import { SpruceFormProps } from "components/SpruceForm";
import { AntdSelect } from "components/SpruceForm/Widgets/AntdWidgets";
import {
  buildRegexSelectors,
  failureTypeSubscriberOptions,
  requesterSubscriberOptions,
  taskRegexSelectors,
} from "constants/triggers";
import {
  RegexSelector,
  SubscriptionMethods,
  Trigger,
  TaskTriggers,
  VersionTriggers,
  ProjectTriggers,
  ExtraFieldKey,
} from "types/triggers";
import { HTTPHeaderRow } from "./HTTPHeaderRow";
import { RegexSelectorRow } from "./RegexSelectorRow";

// Percent change input
const percentChangeInput = {
  schema: {
    type: "string" as "string",
    title: "Percent Change",
    format: "validPercentage",
    default: "10",
  },
  uiSchema: {
    "ui:data-cy": "percent-change-input",
  },
};

// Duration change input
const taskDurationInput = {
  schema: {
    type: "string" as "string",
    title: "Task Duration (seconds)",
    format: "validDuration",
    default: "10",
  },
  uiSchema: {
    "ui:data-cy": "duration-change-input",
  },
};
const versionDurationInput = {
  schema: {
    type: "string" as "string",
    title: "Version Duration (seconds)",
    format: "validDuration",
    default: "10",
  },
  uiSchema: {
    "ui:data-cy": "duration-change-input",
  },
};

const testNameRegexInput = {
  schema: {
    type: "string" as "string",
    title: "Test Names Matching Regex",
    format: "validRegex",
    default: "",
  },
  uiSchema: {
    "ui:data-cy": "test-name-regex-input",
  },
};

const renotifyInput = {
  schema: {
    type: "string" as "string",
    title: "Re-Notify After How Many Hours",
    format: "validDuration",
    default: "48",
  },
  uiSchema: {
    "ui:data-cy": "renotify-input",
  },
};

const buildSelect = {
  schema: {
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
  },
  uiSchema: {
    "ui:allowDeselect": false,
    "ui:usePortal": false,
  },
};

const failureSelect = {
  schema: {
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
  },
  uiSchema: {
    "ui:allowDeselect": false,
    "ui:usePortal": false,
  },
};

const getRegexSelectorSchema = (
  regexEnumsToDisable: string[],
  regexSelectors: RegexSelector[]
) => {
  const usingID = regexEnumsToDisable.includes("build-variant");
  return {
    type: "array" as "array",
    minItems: 1,
    maxItems: 2,
    required: ["regexSelect", "regexInput"],
    items: {
      type: "object" as "object",
      properties: {
        regexSelect: {
          type: "string" as "string",
          title: "Field name",
          default: usingID ? "display-name" : "build-variant",
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
  };
};

export const getFormSchema = (
  regexEnumsToDisable: string[],
  triggers: Trigger,
  subscriptionMethods: SubscriptionMethods
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  schema: {
    type: "object" as "object",
    properties: {
      event: {
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
                  extraFields: {},
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
                      [ExtraFieldKey.TASK_PERCENT_CHANGE]:
                        percentChangeInput.schema,
                    },
                  },
                },
              },
              {
                properties: {
                  eventSelect: {
                    enum: [
                      VersionTriggers.VERSION_RUNTIME_CHANGE,
                      ProjectTriggers.VERSION_RUNTIME_CHANGE,
                    ],
                  },
                  extraFields: {
                    type: "object" as "object",
                    title: "",
                    properties: {
                      [ExtraFieldKey.VERSION_PERCENT_CHANGE]:
                        percentChangeInput.schema,
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
                      [ExtraFieldKey.TASK_DURATION_SECS]:
                        taskDurationInput.schema,
                    },
                  },
                },
              },
              {
                properties: {
                  eventSelect: {
                    enum: [
                      VersionTriggers.VERSION_EXCEEDS_DURATION,
                      ProjectTriggers.VERSION_EXCEEDS_DURATION,
                    ],
                  },
                  extraFields: {
                    type: "object" as "object",
                    title: "",
                    properties: {
                      [ExtraFieldKey.VERSION_DURATION_SECS]:
                        versionDurationInput.schema,
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
                  regexSelector: getRegexSelectorSchema(
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
                      [ExtraFieldKey.BUILD_INITIATOR]: buildSelect.schema,
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
                      [ExtraFieldKey.BUILD_INITIATOR]: buildSelect.schema,
                    },
                  },
                  regexSelector: getRegexSelectorSchema(
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
                      [ExtraFieldKey.BUILD_INITIATOR]: buildSelect.schema,
                    },
                  },
                  regexSelector: getRegexSelectorSchema(
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
                      [ExtraFieldKey.FAILURE_TYPE]: failureSelect.schema,
                      [ExtraFieldKey.BUILD_INITIATOR]: buildSelect.schema,
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
                      [ExtraFieldKey.RENOTIFY_INTERVAL]: renotifyInput.schema,
                      [ExtraFieldKey.FAILURE_TYPE]: failureSelect.schema,
                    },
                  },
                  regexSelector: getRegexSelectorSchema(
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
                      [ExtraFieldKey.TEST_REGEX]: testNameRegexInput.schema,
                      [ExtraFieldKey.RENOTIFY_INTERVAL]: renotifyInput.schema,
                      [ExtraFieldKey.FAILURE_TYPE]: failureSelect.schema,
                    },
                  },
                  regexSelector: getRegexSelectorSchema(
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
                      [ExtraFieldKey.TASK_DURATION_SECS]:
                        taskDurationInput.schema,
                    },
                  },
                  regexSelector: getRegexSelectorSchema(
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
                      [ExtraFieldKey.TASK_PERCENT_CHANGE]:
                        percentChangeInput.schema,
                    },
                  },
                  regexSelector: getRegexSelectorSchema(
                    regexEnumsToDisable,
                    taskRegexSelectors
                  ),
                },
              },
            ],
          },
        },
      },
      notification: {
        type: "object" as "object",
        title: "Choose How to be Notified",
        required: ["notificationSelect"],
        properties: {
          notificationSelect: {
            type: "string" as "string",
            title: "Notification Method",
            oneOf: [
              ...Object.keys(subscriptionMethods).map((method) => ({
                type: "string" as "string",
                title: subscriptionMethods[method].dropdown,
                enum: [method],
              })),
            ],
          },
        },
        dependencies: {
          notificationSelect: {
            oneOf: [
              {
                required: ["jiraInput"],
                properties: {
                  notificationSelect: {
                    enum: ["jira-comment"],
                  },
                  jiraInput: {
                    type: "string" as "string",
                    title: "Comment on a JIRA Issue",
                    format: "validJiraTicket",
                    minLength: 1,
                  },
                },
              },
              {
                required: ["slackInput"],
                properties: {
                  notificationSelect: {
                    enum: ["slack"],
                  },
                  slackInput: {
                    type: "string" as "string",
                    title: "Slack message",
                    format: "validSlack",
                    minLength: 1,
                  },
                },
              },
              {
                required: ["emailInput"],
                properties: {
                  notificationSelect: {
                    enum: ["email"],
                  },
                  emailInput: {
                    type: "string" as "string",
                    title: "Email",
                    format: "validEmail",
                    minLength: 1,
                  },
                },
              },
              {
                properties: {
                  notificationSelect: {
                    enum: ["evergreen-webhook"],
                  },
                  webhookInput: {
                    type: "object" as "object",
                    title: "",
                    required: ["urlInput"],
                    properties: {
                      urlInput: {
                        type: "string" as "string",
                        title: "Webhook URL",
                        minLength: 1,
                      },
                      secretInput: {
                        type: "string" as "string",
                        title: "Webhook Secret",
                      },
                      httpHeaders: {
                        type: "array" as "array",
                        title: "HTTP Headers",
                        items: {
                          type: "object" as "object",
                          properties: {
                            keyInput: {
                              type: "string" as "string",
                              title: "Key",
                            },
                            valueInput: {
                              type: "string" as "string",
                              title: "Value",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              {
                properties: {
                  notificationSelect: {
                    enum: ["jira-issue"],
                  },
                  jiraIssueInput: {
                    type: "object" as "object",
                    title: "",
                    required: ["projectInput", "issueInput"],
                    properties: {
                      projectInput: {
                        type: "string" as "string",
                        title: "JIRA Project",
                        minLength: 1,
                      },
                      issueInput: {
                        type: "string" as "string",
                        title: "Issue Type",
                        minLength: 1,
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  uiSchema: {
    event: {
      eventSelect: {
        "ui:allowDeselect": false,
        "ui:usePortal": false,
        "ui:data-cy": "event-trigger-select",
        "ui:widget": AntdSelect,
      },
      extraFields: {
        "ui:showLabel": false,
        [ExtraFieldKey.BUILD_INITIATOR]: {
          "ui:widget": AntdSelect,
        },
        [ExtraFieldKey.FAILURE_TYPE]: {
          "ui:widget": AntdSelect,
        },
      },
      regexSelector: {
        "ui:showLabel": false,
        "ui:addToEnd": true,
        "ui:orderable": false,
        "ui:addButtonText": "Add Additional Criteria",
        items: {
          "ui:ObjectFieldTemplate": RegexSelectorRow,
          regexSelect: {
            "ui:allowDeselect": false,
            "ui:usePortal": false,
            "ui:data-cy": "regex-select",
            "ui:disabledEnums": regexEnumsToDisable,
            "ui:widget": AntdSelect,
          },
          regexInput: {
            "ui:data-cy": "regex-input",
          },
        },
      },
    },
    notification: {
      notificationSelect: {
        "ui:allowDeselect": false,
        "ui:usePortal": false,
        "ui:data-cy": "notification-method-select",
        "ui:widget": AntdSelect,
      },
      jiraInput: {
        "ui:placeholder": "ABC-123",
        "ui:data-cy": "jira-comment-input",
      },
      slackInput: {
        "ui:placeholder": "@user or #channel",
        "ui:data-cy": "slack-input",
      },
      emailInput: {
        "ui:placeholder": "someone@example.com",
        "ui:data-cy": "email-input",
      },
      jiraIssueInput: {
        projectInput: {
          "ui:placeholder": "ABC",
        },
        issueInput: {
          "ui:placeholder": "Build Failure",
        },
      },
      webhookInput: {
        urlInput: {
          "ui:placeholder": "https://example.com",
        },
        secretInput: {
          "ui:readonly": true,
        },
        httpHeaders: {
          "ui:addToEnd": true,
          "ui:orderable": false,
          "ui:addButtonText": "Add HTTP Header",
          items: {
            "ui:ObjectFieldTemplate": HTTPHeaderRow,
          },
        },
      },
    },
  },
});
