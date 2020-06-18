export interface SubscriptionMethod {
  label: string;
  value: string;
}

export const SUBSCRIPTION_JIRA_COMMENT: SubscriptionMethod = {
  value: "jira-comment",
  label: "comment on a JIRA issue",
};

export const SUBSCRIPTION_SLACK: SubscriptionMethod = {
  value: "slack",
  label: "send a slack message",
};

export const SUBSCRIPTION_EMAIL: SubscriptionMethod = {
  value: "email",
  label: "send an email",
};
