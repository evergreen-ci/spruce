import { BannerTheme } from "gql/generated/types";
import { Unpacked } from "types/utils";
import { ProjectType } from "../utils/types";

export type Notification = Partial<{
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
    retryInput: number;
    minDelayInput: number;
    timeoutInput: number;
  };
}>;

export interface NotificationsFormState {
  buildBreakSettings: {
    notifyOnBuildFailure: boolean | null;
  };
  subscriptions: Array<{
    subscriptionData: {
      id: string;
      event: {
        eventSelect: string;
        extraFields: FormExtraFields;
        regexSelector?: FormRegexSelector[];
      };
      notification: Notification;
    };
  }> | null;
  banner?: {
    bannerData: {
      text: string;
      theme: BannerTheme;
    };
  };
}

// This utils file contains functions used to process the form state.
export type SubscriptionData = Unpacked<
  NotificationsFormState["subscriptions"]
>["subscriptionData"];

export type TabProps = {
  projectData?: NotificationsFormState;
  projectType: ProjectType;
  repoData?: NotificationsFormState;
  id?: string;
};

export interface FormRegexSelector {
  regexSelect?: string;
  regexInput?: string;
}

export interface FormExtraFields {
  [key: string]: string;
}
