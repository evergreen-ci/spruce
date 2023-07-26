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
    label: "Comment on a JIRA issue",
    value: NotificationMethods.JIRA_COMMENT,
  },
  {
    label: "Slack message",
    value: NotificationMethods.SLACK,
  },
  {
    label: "Email",
    value: NotificationMethods.EMAIL,
  },
];

export const projectSubscriptionMethods = [
  ...subscriptionMethods,
  {
    label: "Webhook",
    value: NotificationMethods.WEBHOOK,
  },
  {
    label: "Create a JIRA Issue",
    value: NotificationMethods.JIRA_ISSUE,
  },
];

/** Map a NotificationMethods enum to its label */
export const notificationMethodToCopy = projectSubscriptionMethods.reduce(
  (obj, { label, value }) => ({
    ...obj,
    [value]: label,
  }),
  {}
);
