import { NotificationMethods } from "types/subscription";
import { Unpacked } from "types/utils";
import { numbers } from "utils";
import { FormState, Notification } from "./types";

const { cryptoRandom } = numbers;

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
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 64; i++) {
    text += possible.charAt(Math.floor(cryptoRandom() * possible.length));
  }

  return text;
};
