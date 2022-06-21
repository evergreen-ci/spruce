import { SpruceFormProps } from "components/SpruceForm";
import { RegexSelector, SubscriptionMethods, Trigger } from "types/triggers";
import { RegexSelectorRow } from "./RegexSelectorRow";

const getRegexSelectorSchema = (formState, regexSelectors: RegexSelector[]) => {
  const usingID = !!formState?.event?.extraFields?.regexSelector?.find(
    (r) => r.regexSelect === "build-variant"
  );
  const usingName = !!formState?.event?.extraFields?.regexSelector?.find(
    (r) => r.regexSelect === "display-name"
  );
  const regexEnumsToDisable = [
    ...(usingID ? ["build-variant"] : []),
    ...(usingName ? ["display-name"] : []),
  ];

  return {
    schema: {
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
    },
    uiSchema: {
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
        },
        regexInput: {
          "ui:data-cy": "regex-input",
        },
      },
    },
  };
};

// Reminder; give a type to form state
export const getFormSchema = (
  formState,
  triggers: Trigger,
  subscriptionMethods: SubscriptionMethods
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => {
  const selectedMethod =
    subscriptionMethods[formState.notification.notificationSelect];
  console.log(selectedMethod);

  return {
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
              // generate the dependencies array based on the outlined triggers.
              oneOf: [
                ...Object.keys(triggers).map((t) => {
                  const properties: {
                    [key: string]: any;
                  } = {};

                  // Adding extra fields.
                  const extraFields = triggers[t].extraFields ?? [];
                  extraFields.forEach((e) => {
                    let fieldToAdd = {};

                    if (e.fieldType === "input") {
                      fieldToAdd = {
                        type: "string" as "string",
                        title: e.text,
                        format: e.format,
                        default: e.default,
                      };
                    } else {
                      fieldToAdd = {
                        type: "string" as "string",
                        title: e.text,
                        oneOf: Object.keys(e.options).map((o) => ({
                          type: "string" as "string",
                          title: e.options[o],
                          enum: [o],
                        })),
                        default: e.default,
                      };
                    }

                    properties[e.key] = fieldToAdd;
                  });

                  console.log("------");
                  console.log("BEFORE: ", t, properties);

                  // Adding regex selectors
                  if (triggers[t].regexSelectors) {
                    properties.regexSelector = getRegexSelectorSchema(
                      formState,
                      triggers[t].regexSelectors
                    ).schema;
                  }

                  console.log("AFTER: ", t, properties);
                  console.log("------");

                  return {
                    properties: {
                      eventSelect: {
                        enum: [t],
                      },
                      extraFields: {
                        type: "object" as "object",
                        title: "",
                        properties,
                      },
                    },
                  };
                }),
              ],
            },
          },
        },
        // ------------ DONE ------- //
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
        },
        extraFields: {
          "ui:showLabel": false,
          requester: {
            "ui:allowDeselect": false,
            "ui:usePortal": false,
          },
          "failure-type": {
            "ui:allowDeselect": false,
            "ui:usePortal": false,
          },
          regexSelector: getRegexSelectorSchema(formState, []).uiSchema,
        },
      },
      notification: {
        notificationSelect: {
          "ui:allowDeselect": false,
          "ui:usePortal": false,
          "ui:data-cy": "notification-method-select",
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
      },
    },
  };
};
