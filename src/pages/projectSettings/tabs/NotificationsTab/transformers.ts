import { projectTriggers } from "constants/triggers";
import { ProjectInput } from "gql/generated/types";
import { string } from "utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

const { toSentenceCase } = string;

const getSubscriber = (subscriberType: string, subscriber) => {
  switch (subscriberType) {
    case "jira-comment":
      return subscriber.jiraCommentSubscriber;
    case "slack":
      return subscriber.slackSubscriber;
    case "email":
      return subscriber.emailSubscriber;
    case "evergreen-webhook":
      return subscriber.webhookSubscriber.url;
    case "jira-issue":
      return subscriber.jiraIssueSubscriber.projectInput;
    default:
      return "";
  }
};

const getDisplayTitle = (
  resourceType: string,
  trigger: string,
  subscriberType: string,
  subscriber
) => {
  const triggerText =
    resourceType && trigger
      ? `${toSentenceCase(resourceType)} ${trigger} `
      : "New Subscription";
  const subscriberText = getSubscriber(subscriberType, subscriber);
  return `${triggerText} - ${subscriberText}`;
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
  if (!triggerData) return {};

  const extraFields = {};
  projectTriggers[triggerEnum].extraFields.forEach((e) => {
    extraFields[e.key] = triggerData[e.key];
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

export const gqlToForm: GqlToFormFunction = (data): FormState => {
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
            ownerType,
            triggerData,
            regexSelectors,
            subscriber,
          }) => {
            const triggerEnum = getTriggerEnum(trigger, resourceType);
            const {
              subscriber: subscriberList,
              type: subscriberType,
            } = subscriber;
            const {
              jiraCommentSubscriber,
              slackSubscriber,
              emailSubscriber,
              jiraIssueSubscriber,
              webhookSubscriber,
            } = subscriberList;

            return {
              id,
              resourceType,
              trigger,
              ownerType,
              displayTitle: getDisplayTitle(
                resourceType,
                trigger,
                subscriberType,
                subscriberList
              ),
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
                  jiraCommentInput: jiraCommentSubscriber ?? "",
                  slackInput: slackSubscriber ?? "",
                  emailInput: emailSubscriber ?? "",
                  jiraIssueInput: {
                    projectInput: jiraIssueSubscriber?.project ?? "",
                    issueInput: jiraIssueSubscriber?.issueType ?? "",
                  },
                  webhookInput: {
                    urlInput: webhookSubscriber?.url ?? "",
                    secretInput: webhookSubscriber?.secret ?? "",
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

export const formToGql: FormToGqlFunction = (
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
