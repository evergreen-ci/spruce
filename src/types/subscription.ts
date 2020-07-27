export interface SubscriptionMethodDropdownOption {
  label: string;
  value: string;
}

export const SUBSCRIPTION_JIRA_COMMENT: SubscriptionMethodDropdownOption = {
  value: "jira-comment",
  label: "Comment on a JIRA issue",
};

export const SUBSCRIPTION_SLACK: SubscriptionMethodDropdownOption = {
  value: "slack",
  label: "Slack message",
};

export const SUBSCRIPTION_EMAIL: SubscriptionMethodDropdownOption = {
  value: "email",
  label: "Email",
};
