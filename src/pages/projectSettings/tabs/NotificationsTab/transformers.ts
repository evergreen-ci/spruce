import { ProjectSettingsTabRoutes } from "constants/routes";
import { projectTriggers } from "constants/triggers";
import { Subscriber, ProjectInput } from "gql/generated/types";
import { NotificationMethods } from "types/subscription";
import { string } from "utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

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

const getTriggerText = (trigger: string, resourceType: string) => {
  const triggerText =
    resourceType && trigger
      ? `${toSentenceCase(resourceType)} ${trigger} `
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
  projectTriggers[triggerEnum].extraFields.forEach((e) => {
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
                    secretInput:
                      webhookSubscriber?.secret ??
                      "I-should-be-generated (EVG-17181)",
                    httpHeaders: getHttpHeaders(webhookSubscriber?.headers),
                  },
                },
              },
              subscriberData: {
                subscriberType,
                subscriberName: subscriberText,
              },
            };
          }
        )
      : [],
  };
};

export const formToGql: FormToGqlFunction<Tab> = (
  { buildBreakSettings }: FormState,
  id
) => {
  const projectRef: ProjectInput = {
    id,
    notifyOnBuildFailure: buildBreakSettings.notifyOnBuildFailure,
  };
  // TODO in EVG-16971
  return {
    projectRef,
  };
};
