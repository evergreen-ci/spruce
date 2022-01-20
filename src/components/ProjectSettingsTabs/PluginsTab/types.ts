import { FormDataProps } from "components/SpruceForm";

export interface FormState extends FormDataProps {
  performanceSettings: {
    perfEnabled: boolean | null;
  };
  buildBaronSettings: {
    taskAnnotationSettings: {
      jiraCustomFields: Array<{
        field: string;
        displayText: string;
      }> | null;
    };
    useBuildBaron: boolean | null;
    ticketSearchProjects: Array<{
      searchProject: string;
    }> | null;
    ticketCreateProject: {
      createProject: string | null;
    };
    fileTicketWebhook: {
      endpoint: string | null;
      secret: string | null;
    } | null;
  };
}

export type TabProps = {
  projectData?: FormState;
  repoData?: FormState;
  useRepoSettings: boolean;
};
