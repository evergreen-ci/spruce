export interface SubscriptionMethod {
  label: string;
  value: string;
}

export const SUBSCRIPTION_JIRA_COMMENT: SubscriptionMethod = {
  value: "jira-comment",
  label: "Comment on a JIRA issue",
};

export const SUBSCRIPTION_SLACK: SubscriptionMethod = {
  value: "slack",
  label: "Slack message",
};

export const SUBSCRIPTION_EMAIL: SubscriptionMethod = {
  value: "email",
  label: "Email",
};
