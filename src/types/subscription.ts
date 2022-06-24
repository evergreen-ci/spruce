export interface SubscriptionMethodOption {
  label: string;
  value: string;
}

export enum NotificationMethods {
  JIRA_COMMENT = "jira-comment",
  JIRA_ISSUE = "jira-issue",
  WEBHOOK = "evergreen-webhook",
  SLACK = "slack",
  EMAIL = "email",
}

export const subscriptionMethods: SubscriptionMethodOption[] = [
  {
    value: NotificationMethods.JIRA_COMMENT,
    label: "Comment on a JIRA issue",
  },
  {
    value: NotificationMethods.SLACK,
    label: "Slack message",
  },
  {
    value: NotificationMethods.EMAIL,
    label: "Email",
  },
];

export const projectSubscriptionMethods = [
  ...subscriptionMethods,
  {
    value: NotificationMethods.WEBHOOK,
    label: "Evergreen Webhook",
  },
  {
    value: NotificationMethods.JIRA_ISSUE,
    label: "Create a JIRA Issue",
  },
];
