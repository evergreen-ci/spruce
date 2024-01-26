import { ProjectType } from "../utils";

export interface PluginsFormState {
  performanceSettings: {
    perfEnabled: boolean | null;
  };
  buildBaronSettings: {
    taskAnnotationSettings: {
      jiraCustomFields: Array<{
        field: string;
        displayText: string;
      }>;
    };
    useBuildBaron: boolean | null;
    ticketSearchProjects: Array<{ searchProject: string }>;
    ticketCreateProject: {
      createProject: string;
    };
    ticketCreateIssueType: {
      issueType: string;
    };
    fileTicketWebhook: {
      endpoint: string;
      secret: string;
    };
  };
  externalLinks: Array<{
    displayTitle: string;
    requesters: string[];
    displayName: string;
    urlTemplate: string;
  }>;
}

export type TabProps = {
  projectData?: PluginsFormState;
  projectType: ProjectType;
  repoData?: PluginsFormState;
};
