import { Subset, Unpacked } from "types/utils";
import { ProjectType } from "../utils/types";

export type Notification = Subset<{
  notificationSelect: string;
  jiraCommentInput: string;
  slackInput: string;
  emailInput: string;
  jiraIssueInput: {
    projectInput: string;
    issueInput: string;
  };
  webhookInput: {
    urlInput: string;
    secretInput: string;
    httpHeaders: { [key: string]: string }[];
  };
}>;

export interface FormState {
  buildBreakSettings: {
    notifyOnBuildFailure: boolean | null;
  };
  subscriptions: Array<
    Subset<{
      subscriptionData: {
        event: {
          eventSelect: string;
          extraFields: { [key: string]: string };
          regexSelector: FormRegexSelector[];
        };
        notification: Notification;
      };
      subscriberData: {
        subscriberType: string;
        subscriberName: string;
      };
    }>
  > | null;
}

// This utils file contains functions used to process the form state.
export type SubscriptionData = Unpacked<
  FormState["subscriptions"]
>["subscriptionData"];

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
  id?: string;
};

export interface FormRegexSelector {
  regexSelect?: string;
  regexInput?: string;
}

export interface FormExtraFields {
  [key: string]: string;
}
