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
  regexForm: FormRegexSelector[],
) =>
  hasRegexSelectors && regexForm
    ? regexForm.map((r) => ({
        type: r.regexSelect,
        data: r.regexInput,
      }))
    : [];

const webhookFormToGql = (webhookInput: Notification["webhookInput"]) => {
  if (!webhookInput) {
    return null;
  }
  return {
    url: webhookInput.urlInput,
    // Use existing secret if it was already generated, otherwise generate a new secret.
    secret: webhookInput.secretInput || generateWebhookSecret(),
    headers:
      webhookInput.httpHeaders?.map(({ keyInput, valueInput }) => ({
        key: keyInput,
        value: valueInput,
      })) ?? [],
    retries: webhookInput.retryInput ?? 0,
    minDelayMs: webhookInput.minDelayInput ?? 0,
    timeoutMs: webhookInput.timeoutInput ?? 0,
  };
};

const jiraFormToGql = (jiraInput: Notification["jiraIssueInput"]) => {
  if (!jiraInput) {
    return null;
  }
  return {
    project: jiraInput.projectInput,
    issueType: jiraInput.issueInput,
  };
};

// Converts the form extraFields into the proper format for GQL payload.
// We need to check what extraFields exist for a particular trigger because it's possible
// for data from other dependencies to persist.
const extraFieldsFormToGql = (
  extraFieldsToInclude: ExtraField[],
  extraFieldsForm: FormExtraFields,
) =>
  (extraFieldsToInclude || []).reduce(
    (acc, e) => {
      if (extraFieldsForm[e.key]) {
        acc[e.key] = extraFieldsForm[e.key].toString();
      }
      return acc;
    },
    {} as { [key: string]: string },
  );

export const getGqlPayload =
  (projectId: string) =>
  (
    subscription: Unpacked<NotificationsFormState["subscriptions"]>,
  ): SubscriptionInput => {
    const { subscriptionData } = subscription || {};
    const event = projectTriggers[subscriptionData?.event?.eventSelect];
    const {
      extraFields,
      regexSelectors,
      resourceType = "",
      trigger,
    } = event || {};

    const triggerData = extraFieldsFormToGql(
      extraFields,
      subscriptionData?.event?.extraFields,
    );

    const regexData = regexFormToGql(
      !!regexSelectors,
      subscriptionData?.event?.regexSelector,
    );

    const method = subscriptionData?.notification?.notificationSelect;
    const subscriber = getTargetForMethod(
      method,
      subscriptionData?.notification,
    );

    const selectors = Object.entries(triggerData)
      .map(([key, value]) => ({
        type: key,
        data: value.toString(),
      }))
      .filter(({ type }) => allowedSelectors.has(type));

    return {
      id: subscriptionData?.id,
      owner_type: "project",
      regex_selectors: regexData,
      resource_type: resourceType,
      selectors: [{ type: "project", data: projectId }, ...selectors],
      subscriber: {
        type: method,
        target: subscriber,
        webhookSubscriber:
          method === NotificationMethods.WEBHOOK
            ? webhookFormToGql(subscriptionData?.notification?.webhookInput)
            : undefined,
        jiraIssueSubscriber:
          method === NotificationMethods.JIRA_ISSUE
            ? jiraFormToGql(subscriptionData?.notification?.jiraIssueInput)
            : undefined,
      },
      trigger,
      trigger_data: triggerData,
    };
  };
