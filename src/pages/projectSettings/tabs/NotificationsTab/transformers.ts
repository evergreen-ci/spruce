import { ProjectSettingsTabRoutes } from "constants/routes";
import { projectTriggers } from "constants/triggers";
import {
  Subscriber,
  ProjectInput,
  SubscriptionInput,
} from "gql/generated/types";
import { NotificationMethods } from "types/subscription";
import { TriggerType } from "types/triggers";
import { string } from "utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";
import { getGqlPayload } from "./utils";

type Tab = ProjectSettingsTabRoutes.Notifications;

const { toSentenceCase } = string;

const getSubscriberText = (subscriberType: string, subscriber: Subscriber) => {
  switch (subscriberType) {
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

const convertFamilyTrigger = (trigger: string) => {
  switch (trigger) {
    case TriggerType.FAMILY_OUTCOME:
      return TriggerType.OUTCOME;
    case TriggerType.FAMILY_FAILURE:
      return TriggerType.FAILURE;
    case TriggerType.FAMILY_SUCCESS:
      return TriggerType.SUCCESS;
    default:
      return trigger;
  }
};

const getTriggerText = (trigger: string, resourceType: string) => {
  const convertedTrigger = convertFamilyTrigger(trigger);
  const triggerText =
    resourceType && trigger
      ? `${toSentenceCase(resourceType)} ${convertedTrigger} `
      : "";
  return triggerText;
};

const getTriggerEnum = (trigger: string, resourceType: string) => {
  const triggerEnum = Object.keys(projectTriggers).find(
    (t) =>
      projectTriggers[t].trigger === trigger &&
      projectTriggers[t].resourceType === resourceType
  );
  return triggerEnum;
};

const getExtraFields = (
  triggerEnum: string,
  triggerData: { [key: string]: string }
) => {
  // If there are no extra fields, just return.
  if (!triggerData) return {};

  const extraFields = {};
  projectTriggers[triggerEnum]?.extraFields.forEach((e) => {
    // Extra fields that are numbers must be converted in order to fulfill the form schema.
    const isNumber = e.format === "number";
    extraFields[e.key] = isNumber
      ? parseInt(triggerData[e.key], 10)
      : triggerData[e.key];
  });
  return extraFields;
};

const getHttpHeaders = (headers: { key: string; value: string }[]) =>
  headers
    ? headers.map((h) => ({
        keyInput: h.key,
        valueInput: h.value,
      }))
    : [];

export const gqlToForm: GqlToFormFunction<Tab> = (data) => {
  if (!data) return null;
  const { projectRef, subscriptions } = data;

  return {
    buildBreakSettings: {
      notifyOnBuildFailure: projectRef.notifyOnBuildFailure,
    },
    subscriptions: subscriptions
      ? subscriptions?.map(
          ({
            id,
            resourceType,
            trigger,
            triggerData,
            regexSelectors,
            subscriber,
          }) => {
            // Find and process information about trigger.
            const triggerEnum = getTriggerEnum(trigger, resourceType);
            const triggerText = getTriggerText(trigger, resourceType);

            // Find and process information about subscriber.
            const { type: subscriberType, subscriber: subscribers } =
              subscriber;
            const {
              jiraCommentSubscriber,
              slackSubscriber,
              emailSubscriber,
              jiraIssueSubscriber,
              webhookSubscriber,
            } = subscribers;
            const subscriberText = getSubscriberText(
              subscriberType,
              subscribers
            );

            return {
              displayTitle: `${triggerText} - ${subscriberText}`,
              subscriptionData: {
                id,
                event: {
                  eventSelect: triggerEnum,
                  extraFields: getExtraFields(triggerEnum, triggerData),
                  regexSelector: regexSelectors.map((r) => ({
                    regexSelect: r.type,
                    regexInput: r.data,
                  })),
                },
                notification: {
                  notificationSelect: subscriberType,
                  jiraCommentInput: jiraCommentSubscriber ?? undefined,
                  slackInput: slackSubscriber ?? undefined,
                  emailInput: emailSubscriber ?? undefined,
                  jiraIssueInput: {
                    projectInput: jiraIssueSubscriber?.project ?? undefined,
                    issueInput: jiraIssueSubscriber?.issueType ?? undefined,
                  },
                  webhookInput: {
                    urlInput: webhookSubscriber?.url ?? undefined,
                    secretInput: webhookSubscriber?.secret,
                    httpHeaders: getHttpHeaders(webhookSubscriber?.headers),
                  },
                },
              },
            };
          }
        )
      : [],
  };
};

export const formToGql: FormToGqlFunction<Tab> = (
  formState: FormState,
  projectId
) => {
  const { buildBreakSettings, subscriptions } = formState;
  const projectRef: ProjectInput = {
    id: projectId,
    notifyOnBuildFailure: buildBreakSettings.notifyOnBuildFailure,
  };
  const transformedSubscriptions: SubscriptionInput[] = subscriptions.map(
    getGqlPayload(projectId)
  );
  return {
    projectRef,
    subscriptions: transformedSubscriptions,
  };
};
