import { SubscriberWrapper } from "gql/generated/types";
import { NotificationMethods } from "types/subscription";

export const getSubscriberText = (subscriberWrapper: SubscriberWrapper) => {
  const { type, subscriber } = subscriberWrapper;
  switch (type) {
    case NotificationMethods.JIRA_COMMENT:
      return subscriber.jiraCommentSubscriber;
    case NotificationMethods.SLACK:
      return subscriber.slackSubscriber;
    case NotificationMethods.EMAIL:
      return subscriber.emailSubscriber;
    case NotificationMethods.WEBHOOK:
      return subscriber.webhookSubscriber.url;
    case NotificationMethods.JIRA_ISSUE:
      return subscriber.jiraIssueSubscriber.project;
    default:
      return "";
  }
};
