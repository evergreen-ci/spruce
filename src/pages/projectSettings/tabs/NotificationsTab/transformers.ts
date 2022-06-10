import { ProjectInput, Subscriber } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

export const getSubscriberTitle = (subscriber: Subscriber) =>
  Object.values(subscriber);

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
            selectors,
            regexSelectors,
            subscriber,
          }) => ({
            id,
            resourceType,
            trigger,
            ownerType,
            triggerData,
            selectors: Object.entries(selectors).map(([, d]) => d),
            regexSelectors: Object.entries(regexSelectors).map(([, d]) => d),
            subscriber: {
              title: getSubscriberTitle(subscriber.subscriber),
              githubPRSubscriber: subscriber.subscriber.githubPRSubscriber,
              githubCheckSubscriber:
                subscriber.subscriber.githubCheckSubscriber,
              webhookSubscriber: subscriber.subscriber.webhookSubscriber,
              jiraIssueSubscriber: subscriber.subscriber.jiraIssueSubscriber,
              jiraCommentSubscriber:
                subscriber.subscriber.jiraCommentSubscriber,
              emailSubscriber: subscriber.subscriber.emailSubscriber,
              slackSubscriber: subscriber.subscriber.slackSubscriber,
            },
          })
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

  return {
    projectRef,
  };
};
