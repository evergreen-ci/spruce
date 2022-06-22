import { projectTriggers } from "constants/triggers";
import { ProjectInput, Subscriber } from "gql/generated/types";
import { string } from "utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

const { toSentenceCase } = string;

export const getSubscriberTitle = (subscriber: Subscriber) =>
  Object.values(subscriber);

const getDisplayTitle = (resourceType: string, trigger: string) => {
  const title =
    resourceType && trigger
      ? `${toSentenceCase(resourceType)} ${trigger} `
      : "New Subscription";
  return title;
};

const getTriggerEnum = (trigger: string, resourceType: string) => {
  const triggerEnum = Object.keys(projectTriggers).find(
    (t) =>
      projectTriggers[t].trigger === trigger &&
      projectTriggers[t].resourceType === resourceType
  );
  return triggerEnum;
};

// You might want to use trigger data rather than selectors here.
const getExtraFields = (
  triggerEnum: string,
  triggerData: { [key: string]: string }
) => {
  if (!triggerData) return {};

  const toReturn = {};
  projectTriggers[triggerEnum].extraFields.forEach((e) => {
    toReturn[e.key] = triggerData[e.key];
  });
  return toReturn;
};

const getHttpHeaders = (headers: { key: string; value: string }[]) => {
  const httpHeaders = headers.map((h) => ({
    keyinput: h.key,
    valueInput: h.value,
  }));
  return httpHeaders;
};

export const gqlToForm: GqlToFormFunction = (data): FormState => {
  if (!data) return null;
  const { projectRef, subscriptions } = data;

  console.log("Subscriptions: ", subscriptions);

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

            return {
              id,
              resourceType,
              trigger,
              ownerType,
              // EVENT FIELD
              // based on this stuff I want to restructure the data
              displayTitle: getDisplayTitle(resourceType, trigger),
              subscription: {
                event: {
                  eventSelect: triggerEnum,
                  extraFields: getExtraFields(triggerEnum, triggerData),
                  regexSelector: regexSelectors.map((r) => ({
                    regexSelect: r.type,
                    regexInput: r.data,
                  })),
                },
                // NOTIFICATION FIELD
                notification: {
                  notificationSelect: subscriber.type,
                  jiraInput: subscriber.subscriber.jiraCommentSubscriber ?? "",
                  slackInput: subscriber.subscriber.slackSubscriber ?? "",
                  emailInput: subscriber.subscriber.emailSubscriber ?? "",
                  jiraIssueInput: {
                    projectInput:
                      subscriber.subscriber.jiraIssueSubscriber?.project ?? "",
                    issueInput:
                      subscriber.subscriber.jiraIssueSubscriber?.issueType ??
                      "",
                  },
                  webhookInput: {
                    urlInput:
                      subscriber.subscriber.webhookSubscriber?.url ?? "",
                    secretInput:
                      subscriber.subscriber.webhookSubscriber?.secret ?? "",
                    httpHeaders: getHttpHeaders(
                      subscriber.subscriber.webhookSubscriber?.headers ?? []
                    ),
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
