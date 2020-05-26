export interface SubscriptionMethod {
  label: string;
  value: string;
}

export const SUBSCRIPTION_JIRA_COMMENT: SubscriptionMethod = {
  value: "jira-comment",
  label: "making a comment on a JIRA issue",
};

export const SUBSCRIPTION_SLACK: SubscriptionMethod = {
  value: "slack",
  label: "sending a slack message",
};

export const SUBSCRIPTION_EMAIL: SubscriptionMethod = {
  value: "email",
  label: "sending an email",
};
