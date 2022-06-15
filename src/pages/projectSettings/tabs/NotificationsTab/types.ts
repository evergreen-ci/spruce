import { ProjectType } from "../utils/types";

export interface FormState {
  buildBreakSettings: {
    notifyOnBuildFailure: boolean | null;
  };
  subscriptions: Array<{
    id: string;
    resourceType: string;
    trigger: string;
    ownerType: string;
    triggerData: { [key: string]: any };
    selectors: Array<{
      type: string;
      data: string;
    }>;
    regexSelectors: Array<{
      type: string;
      data: string;
    }>;
    subscriber: {
      githubPRSubscriber?: {
        owner: string;
        repo: string;
        ref: string;
        prNumber?: number;
      };
      githubCheckSubscriber: {
        owner: string;
        repo: string;
        ref: string;
      };
      webhookSubscriber: {
        url: string;
        secret: string;
        headers: Array<{
          key: string;
          value: string;
        }>;
      };
      jiraIssueSubscriber: {
        project: string;
        issueType: string;
      };
      jiraCommentSubscriber: string;
      emailSubscriber: string;
      slackSubscriber: string;
    };
  }> | null;
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
  id?: string;
};
