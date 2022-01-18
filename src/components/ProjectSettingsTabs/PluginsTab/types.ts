import { FormDataProps } from "components/SpruceForm";

export interface FormState extends FormDataProps {
  performanceSettings: {
    perfEnabled: boolean | null;
  };
  buildBaronSettings: {
    ticketSearchProjects: Array<{
      searchProject: string;
    }> | null;
    ticketCreateProject: string | null;
    customTicket: boolean | null;
  };
  taskAnnotationSettings: {
    fileTicketWebhook: {
      endpoint: string | null;
      secret: string | null;
    } | null;
    jiraCustomFields: Array<{
      field: string;
      displayText: string;
    }> | null;
  };
}

export type TabProps = {
  projectData?: FormState;
  repoData?: FormState;
  useRepoSettings: boolean;
};
