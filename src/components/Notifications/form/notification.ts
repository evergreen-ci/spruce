import { FieldRow } from "components/SpruceForm/FieldTemplates";
import { SpruceFormProps } from "components/SpruceForm/types";
import {
  SubscriptionMethodOption,
  NotificationMethods,
} from "types/subscription";

/**
 * getNotificationSchema returns the schema and uiSchema for the notification section of subscriptions.
 * @param subscriptionMethods - an object containing information about available subscription methods. The available
 * subscription methods differ between task/version and project subscriptions.
 * @returns - an object containing the schema and uiSchema for the notification section of subscriptions.
 */
export const getNotificationSchema = (
  subscriptionMethods: SubscriptionMethodOption[]
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  schema: {
    dependencies: {
      notificationSelect: {
        oneOf: [
          {
            properties: {
              jiraCommentInput: {
                format: "validJiraTicket",
                minLength: 1,
                title: "JIRA Issue",
                type: "string" as "string",
              },
              notificationSelect: {
                enum: [NotificationMethods.JIRA_COMMENT],
              },
            },
            required: ["jiraCommentInput"],
          },
          {
            properties: {
              notificationSelect: {
                enum: [NotificationMethods.SLACK],
              },
              slackInput: {
                format: "validSlack",
                minLength: 1,
                title: "Slack message",
                type: "string" as "string",
              },
            },
            required: ["slackInput"],
          },
          {
            properties: {
              emailInput: {
                format: "validEmail",
                minLength: 1,
                title: "Email",
                type: "string" as "string",
              },
              notificationSelect: {
                enum: [NotificationMethods.EMAIL],
              },
            },
            required: ["emailInput"],
          },
          {
            properties: {
              notificationSelect: {
                enum: [NotificationMethods.WEBHOOK],
              },
              webhookInput: {
                properties: {
                  httpHeaders: {
                    items: {
                      properties: {
                        keyInput: {
                          title: "Key",
                          type: "string" as "string",
                        },
                        valueInput: {
                          title: "Value",
                          type: "string" as "string",
                        },
                      },
                      required: ["keyInput", "valueInput"],
                      type: "object" as "object",
                    },
                    title: "HTTP Headers",
                    type: "array" as "array",
                  },
                  minDelayInput: {
                    maximum: 10000,
                    minimum: 0,
                    title: "Minimum delay (ms)",
                    type: "number" as "number",
                  },
                  retryInput: {
                    maximum: 10,
                    minimum: 0,
                    title: "Retry count",
                    type: "number" as "number",
                  },
                  secretInput: {
                    title: "Webhook Secret",
                    type: "string" as "string",
                  },
                  timeoutInput: {
                    maximum: 30000,
                    minimum: 0,
                    title: "Max timeout (ms)",
                    type: "number" as "number",
                  },
                  urlInput: {
                    format: "validURL",
                    minLength: 1,
                    title: "Webhook URL",
                    type: "string" as "string",
                  },
                },
                required: ["urlInput"],
                title: "",
                type: "object" as "object",
              },
            },
          },
          {
            properties: {
              jiraIssueInput: {
                properties: {
                  issueInput: {
                    minLength: 1,
                    title: "Issue Type",
                    type: "string" as "string",
                  },
                  projectInput: {
                    minLength: 1,
                    title: "JIRA Project",
                    type: "string" as "string",
                  },
                },
                required: ["projectInput", "issueInput"],
                title: "",
                type: "object" as "object",
              },
              notificationSelect: {
                enum: [NotificationMethods.JIRA_ISSUE],
              },
            },
          },
        ],
      },
    },
    properties: {
      notificationSelect: {
        oneOf: [
          ...subscriptionMethods.map(({ label, value }) => ({
            enum: [value],
            title: label,
            type: "string" as "string",
          })),
        ],
        title: "Notification Method",
        type: "string" as "string",
      },
    },
    required: ["notificationSelect"],
    title: "Choose How to be Notified",
    type: "object" as "object",
  },
  uiSchema: {
    emailInput: {
      "ui:data-cy": "email-input",
      "ui:placeholder": "someone@example.com",
    },
    jiraCommentInput: {
      "ui:data-cy": "jira-comment-input",
      "ui:placeholder": "ABC-123",
    },
    jiraIssueInput: {
      issueInput: {
        "ui:data-cy": "issue-input",
        "ui:placeholder": "Build Failure",
      },
      projectInput: {
        "ui:data-cy": "project-input",
        "ui:placeholder": "ABC",
      },
    },
    notificationSelect: {
      "ui:allowDeselect": false,
      "ui:data-cy": "notification-method-select",
    },
    slackInput: {
      "ui:data-cy": "slack-input",
      "ui:description":
        "Notifications can be sent to a Slack channel, @user, or member ID represented as an alphanumeric string.",
      "ui:placeholder": "#channel, @user, or MEMBERID",
    },
    webhookInput: {
      httpHeaders: {
        items: {
          "ui:ObjectFieldTemplate": FieldRow,
        },
        "ui:addButtonText": "Add HTTP Header",
        "ui:addToEnd": true,
        "ui:orderable": false,
      },
      minDelayInput: {
        "ui:data-cy": "min-delay-input",
        "ui:optional": true,
        "ui:placeholder": "Defaults to 500 if unset.",
      },
      retryInput: {
        "ui:data-cy": "retry-input",
        "ui:optional": true,
        "ui:placeholder": "Defaults to 0 if unset.",
      },
      secretInput: {
        "ui:data-cy": "secret-input",
        "ui:placeholder":
          "The secret will be shown upon saving the subscription.",
        "ui:readonly": true,
      },
      timeoutInput: {
        "ui:data-cy": "timeout-input",
        "ui:optional": true,
        "ui:placeholder": "Defaults to 10000 if unset.",
      },
      urlInput: {
        "ui:data-cy": "url-input",
        "ui:placeholder": "https://example.com",
      },
    },
  },
});
