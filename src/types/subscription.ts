export interface SubscriptionMethodOption {
  label: string;
  value: string;
}

export const SUBSCRIPTION_JIRA_COMMENT: SubscriptionMethodOption = {
  value: "jira-comment",
  label: "Comment on a JIRA issue",
};

export const SUBSCRIPTION_JIRA_ISSUE: SubscriptionMethodOption = {
  value: "jira-issue",
  label: "Create a JIRA Issue",
};

export const SUBSCRIPTION_WEBHOOK: SubscriptionMethodOption = {
  value: "evergreen-webhook",
  label: "Evergreen Webhook",
};

export const SUBSCRIPTION_SLACK: SubscriptionMethodOption = {
  value: "slack",
  label: "Slack message",
};

export const SUBSCRIPTION_EMAIL: SubscriptionMethodOption = {
  value: "email",
  label: "Email",
};

export const subscriptionMethods = [
  SUBSCRIPTION_JIRA_COMMENT,
  SUBSCRIPTION_SLACK,
  SUBSCRIPTION_EMAIL,
];

export const projectSubscriptionMethods = [
  ...subscriptionMethods,
  SUBSCRIPTION_WEBHOOK,
  SUBSCRIPTION_JIRA_ISSUE,
];
