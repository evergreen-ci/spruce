import { SpruceFormProps } from "components/SpruceForm";
import { AntdSelect } from "components/SpruceForm/Widgets/AntdWidgets";
import { SubscriptionMethodOption } from "types/subscription";
import { HTTPHeaderRow } from "./HTTPHeaderRow";

/**
 * getNotificationSchema returns the schema and uiSchema for the notification section of subscriptions.
 *
 * @param subscriptionMethods - an object containing information about available subscription methods. The available
 * subscription methods differ between task/version and project subscriptions.
 */
export const getNotificationSchema = (
  subscriptionMethods: SubscriptionMethodOption[]
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  schema: {
    type: "object" as "object",
    title: "Choose How to be Notified",
    required: ["notificationSelect"],
    properties: {
      notificationSelect: {
        type: "string" as "string",
        title: "Notification Method",
        oneOf: [
          ...subscriptionMethods.map((method) => ({
            type: "string" as "string",
            title: method.label,
            enum: [method.value],
          })),
        ],
      },
    },
    dependencies: {
      notificationSelect: {
        oneOf: [
          {
            required: ["jiraCommentInput"],
            properties: {
              notificationSelect: {
                enum: ["jira-comment"],
              },
              jiraCommentInput: {
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
  uiSchema: {
    notificationSelect: {
      "ui:allowDeselect": false,
      "ui:usePortal": false,
      "ui:data-cy": "notification-method-select",
      "ui:widget": AntdSelect,
    },
    jiraCommentInput: {
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
        "ui:data-cy": "project-input",
      },
      issueInput: {
        "ui:placeholder": "Build Failure",
        "ui:data-cy": "issue-input",
      },
    },
    webhookInput: {
      urlInput: {
        "ui:placeholder": "https://example.com",
        "ui:data-cy": "url-input",
      },
      secretInput: {
        "ui:readonly": true,
        "ui:data-cy": "secret-input",
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
});
