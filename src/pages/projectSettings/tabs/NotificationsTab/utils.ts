import { NotificationMethods } from "types/subscription";
import { Unpacked } from "types/utils";
import { NotificationsFormState, Notification } from "./types";

export const getTargetForMethod = (
  method: string,
  notification: Notification,
) => {
  switch (method) {
    case NotificationMethods.JIRA_COMMENT:
      return notification.jiraCommentInput;
    case NotificationMethods.SLACK:
      return notification.slackInput;
    case NotificationMethods.EMAIL:
      return notification.emailInput;
    case NotificationMethods.WEBHOOK:
      return notification.webhookInput?.urlInput;
    case NotificationMethods.JIRA_ISSUE:
      return notification.jiraIssueInput?.projectInput;
    default:
      return "";
  }
};

export const hasInitialError = (
  subscription: Unpacked<NotificationsFormState["subscriptions"]>,
) => {
  const { subscriptionData } = subscription || {};
  const { event, notification } = subscriptionData || {};
  const { eventSelect } = event || {};
  const { notificationSelect } = notification || {};

  const target = getTargetForMethod(notificationSelect, notification);
  return !eventSelect || !notificationSelect || !target;
};

export const generateWebhookSecret = () => {
  const arr = new Uint8Array(32);
  const randomValues = crypto.getRandomValues(arr);
  return Array.from(randomValues, (byte) =>
    byte.toString(36).padStart(2, "0"),
  ).join("");
};
