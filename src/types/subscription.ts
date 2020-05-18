interface SubscriptionMethod {
  label: string;
  value: string;
}

export const SUBSCRIPTION_JIRA_COMMENT: SubscriptionMethod = {
  value: "jira-comment",
  label: "making a comment on a JIRA issue",
};

export const SUBSCRIPTION_JIRA_ISSUE: SubscriptionMethod = {
  value: "jira-issue",
  label: "making a jira issue",
};

export const SUBSCRIPTION_SLACK = {
  value: "slack",
  label: "sending a slack message",
};

export const SUBSCRIPTION_EVERGREEN_WEBHOOK: SubscriptionMethod = {
  value: "evergreen-webhook",
  label: "posting to an external server",
};
// Github status api is deliberately omitted here
