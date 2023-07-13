import { ProjectType } from "../utils";

export interface FormState {
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
    fileTicketWebhook: {
      endpoint: string;
      secret: string;
    };
  };
  externalLinks: {
    metadataPanelLink: {
      requesters: string[];
      displayName: string;
      urlTemplate: string;
    };
  };
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
