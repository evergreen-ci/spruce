import { NotificationMethods } from "types/subscription";
import { Unpacked } from "types/utils";
import { FormState, Notification } from "./types";

export const getTargetForMethod = (
  method: string,
  notification: Notification
) => {
  switch (method) {
    case NotificationMethods.JIRA_COMMENT:
      return notification.jiraCommentInput;
    case NotificationMethods.SLACK:
      return notification.slackInput;
    case NotificationMethods.EMAIL:
      return notification.emailInput;
    case NotificationMethods.WEBHOOK:
      return notification.webhookInput.urlInput;
    case NotificationMethods.JIRA_ISSUE:
      return notification.jiraIssueInput.projectInput;
    default:
      return "";
  }
};

export const hasInitialError = (
  subscription: Unpacked<FormState["subscriptions"]>
) => {
  const { subscriptionData } = subscription;
  const trigger = subscriptionData.event.eventSelect;
  const method = subscriptionData.notification.notificationSelect;
  const target = getTargetForMethod(method, subscriptionData.notification);
  return !trigger || !method || !target;
};

export const generateWebhookSecret = () => {
  const arr = new Uint8Array(32);
  const randomValues = crypto.getRandomValues(arr);
  return Array.from(randomValues, (byte) =>
    byte.toString(36).padStart(2, "0")
  ).join("");
};
