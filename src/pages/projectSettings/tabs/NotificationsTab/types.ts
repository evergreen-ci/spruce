import { ProjectType } from "../utils/types";

export interface FormState {
  buildBreakSettings: {
    notifyOnBuildFailure: boolean | null;
  };
  subscriptions: Array<{
    subscriptionData: {
      event: {
        eventSelect: string;
        extraFields: { [key: string]: string };
        regexSelector: { [key: string]: string }[];
      };
      notification: {
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
      };
    };
    subscriberData: {
      subscriberType: string;
      subscriberName: string;
    };
  }> | null;
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
  id?: string;
};
