import { projectTriggers, allowedSelectors } from "constants/triggers";
import { SubscriptionInput } from "gql/generated/types";
import { NotificationMethods } from "types/subscription";
import { ExtraField } from "types/triggers";
import { Unpacked } from "types/utils";
import {
  NotificationsFormState,
  Notification,
  FormExtraFields,
  FormRegexSelector,
} from "./types";
import { getTargetForMethod, generateWebhookSecret } from "./utils";

// Converts the form regexSelector into the proper format for GQL payload.
// We need to check if the trigger has regex selectors because it's possible for data
// from other dependencies to persist.
const regexFormToGql = (
  hasRegexSelectors: boolean,
  regexForm: FormRegexSelector[]
) =>
  hasRegexSelectors && regexForm
    ? regexForm.map((r) => ({
        data: r.regexInput,
        type: r.regexSelect,
      }))
    : [];

const webhookFormToGql = (webhookInput: Notification["webhookInput"]) => {
  if (!webhookInput) {
    return null;
  }
  return {
    // Use existing secret if it was already generated, otherwise generate a new secret.
    secret: webhookInput.secretInput || generateWebhookSecret(),

    headers:
      webhookInput.httpHeaders?.map(({ keyInput, valueInput }) => ({
        key: keyInput,
        value: valueInput,
      })) ?? [],
    minDelayMs: webhookInput.minDelayInput ?? 0,
    retries: webhookInput.retryInput ?? 0,
    timeoutMs: webhookInput.timeoutInput ?? 0,
    url: webhookInput.urlInput,
  };
};

const jiraFormToGql = (jiraInput: Notification["jiraIssueInput"]) => {
  if (!jiraInput) {
    return null;
  }
  return {
    issueType: jiraInput.issueInput,
    project: jiraInput.projectInput,
  };
};

// Converts the form extraFields into the proper format for GQL payload.
// We need to check what extraFields exist for a particular trigger because it's possible
// for data from other dependencies to persist.
const extraFieldsFormToGql = (
  extraFieldsToInclude: ExtraField[],
  extraFieldsForm: FormExtraFields
) =>
  (extraFieldsToInclude || []).reduce((acc, e) => {
    if (extraFieldsForm[e.key]) {
      acc[e.key] = extraFieldsForm[e.key].toString();
    }
    return acc;
  }, {} as { [key: string]: string });

export const getGqlPayload =
  (projectId: string) =>
  (
    subscription: Unpacked<NotificationsFormState["subscriptions"]>
  ): SubscriptionInput => {
    const { subscriptionData } = subscription;
    const event = projectTriggers[subscriptionData.event.eventSelect];
    const {
      extraFields,
      regexSelectors,
      resourceType = "",
      trigger,
    } = event || {};

    const triggerData = extraFieldsFormToGql(
      extraFields,
      subscriptionData.event.extraFields
    );

    const regexData = regexFormToGql(
      !!regexSelectors,
      subscriptionData.event.regexSelector
    );

    const method = subscriptionData.notification.notificationSelect;
    const subscriber = getTargetForMethod(
      method,
      subscriptionData?.notification
    );

    const selectors = Object.entries(triggerData)
      .map(([key, value]) => ({
        data: value.toString(),
        type: key,
      }))
      .filter(({ type }) => allowedSelectors.has(type));

    return {
      id: subscriptionData.id,
      owner_type: "project",
      regex_selectors: regexData,
      resource_type: resourceType,
      selectors: [{ data: projectId, type: "project" }, ...selectors],
      subscriber: {
        jiraIssueSubscriber:
          method === NotificationMethods.JIRA_ISSUE
            ? jiraFormToGql(subscriptionData.notification?.jiraIssueInput)
            : undefined,
        target: subscriber,
        type: method,
        webhookSubscriber:
          method === NotificationMethods.WEBHOOK
            ? webhookFormToGql(subscriptionData.notification?.webhookInput)
            : undefined,
      },
      trigger,
      trigger_data: triggerData,
    };
  };
