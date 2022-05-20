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
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
