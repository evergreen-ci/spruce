import { FieldRow } from "components/SpruceForm/FieldTemplates";
import { SpruceFormProps } from "components/SpruceForm/types";
import { JiraTicketType } from "types/jira";
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
  subscriptionMethods: SubscriptionMethodOption[],
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
        default: "",
        oneOf: [
          ...subscriptionMethods.map(({ label, value }) => ({
            type: "string" as "string",
            title: label,
            enum: [value],
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
                enum: [NotificationMethods.JIRA_COMMENT],
              },
              jiraCommentInput: {
                type: "string" as "string",
                title: "JIRA Issue",
                format: "validJiraTicket",
                minLength: 1,
              },
            },
          },
          {
            required: ["slackInput"],
            properties: {
              notificationSelect: {
                enum: [NotificationMethods.SLACK],
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
                enum: [NotificationMethods.EMAIL],
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
                enum: [NotificationMethods.WEBHOOK],
              },
              webhookInput: {
                type: "object" as "object",
                title: "",
                required: ["urlInput"],
                properties: {
                  urlInput: {
                    type: "string" as "string",
                    title: "Webhook URL",
                    format: "validURL",
                    minLength: 1,
                  },
                  secretInput: {
                    type: "string" as "string",
                    title: "Webhook Secret",
                  },
                  retryInput: {
                    type: "number" as "number",
                    title: "Retry count",
                    minimum: 0,
                    maximum: 10,
                  },
                  minDelayInput: {
                    type: "number" as "number",
                    title: "Minimum delay (ms)",
                    minimum: 0,
                    maximum: 10000,
                  },
                  timeoutInput: {
                    type: "number" as "number",
                    title: "Max timeout (ms)",
                    minimum: 0,
                    maximum: 30000,
                  },
                  httpHeaders: {
                    type: "array" as "array",
                    title: "HTTP Headers",
                    items: {
                      type: "object" as "object",
                      required: ["keyInput", "valueInput"],
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
                enum: [NotificationMethods.JIRA_ISSUE],
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
      "ui:data-cy": "notification-method-select",
      "ui:allowDeselect": false,
    },
    jiraCommentInput: {
      "ui:placeholder": "ABC-123",
      "ui:data-cy": "jira-comment-input",
    },
    slackInput: {
      "ui:description":
        "Notifications can be sent to a Slack channel, @user, or member ID represented as an alphanumeric string.",
      "ui:placeholder": "#channel, @user, or MEMBERID",
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
        "ui:placeholder": JiraTicketType.BuildFailure,
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
        "ui:placeholder":
          "The secret will be shown upon saving the subscription.",
        "ui:data-cy": "secret-input",
      },
      retryInput: {
        "ui:data-cy": "retry-input",
        "ui:placeholder": "Defaults to 0 if unset.",
        "ui:optional": true,
      },
      minDelayInput: {
        "ui:data-cy": "min-delay-input",
        "ui:placeholder": "Defaults to 500 if unset.",
        "ui:optional": true,
      },
      timeoutInput: {
        "ui:data-cy": "timeout-input",
        "ui:placeholder": "Defaults to 10000 if unset.",
        "ui:optional": true,
      },
      httpHeaders: {
        "ui:addToEnd": true,
        "ui:orderable": false,
        "ui:addButtonText": "Add HTTP Header",
        items: {
          "ui:ObjectFieldTemplate": FieldRow,
        },
      },
    },
  },
});
