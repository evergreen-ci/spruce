import {
  ProjectInput,
  ProjectSettingsInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { FormState } from "./types";

export const gqlToForm = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"]
): FormState => {
  if (!data) return null;

  const { projectRef } = data;
  return {
    performanceSettings: {
      perfEnabled: projectRef.perfEnabled,
    },
    buildBaronSettings: {
      ticketCreateProject: projectRef.buildBaronSettings.ticketCreateProject,
      ticketSearchProjects: projectRef.buildBaronSettings.ticketSearchProjects
        ? projectRef.buildBaronSettings.ticketSearchProjects.map(
            (searchProject) => ({ searchProject })
          )
        : [],
      customTicket: projectRef.buildBaronSettings.ticketCreateProject == null,
    },
    taskAnnotationSettings: {
      fileTicketWebhook: {
        endpoint: projectRef.taskAnnotationSettings.fileTicketWebhook.endpoint,
        secret: projectRef.taskAnnotationSettings.fileTicketWebhook.secret,
      },
      jiraCustomFields: projectRef.taskAnnotationSettings.jiraCustomFields
        ? projectRef.taskAnnotationSettings.jiraCustomFields.map(
            ({ field, displayText }) => ({ field, displayText })
          )
        : [],
    },
  };
};

export const formToGql = (
  {
    performanceSettings,
    buildBaronSettings,
    taskAnnotationSettings,
  }: FormState,
  id: string
): Pick<ProjectSettingsInput, "projectRef"> => {
  const projectRef: ProjectInput = {
    id,
    perfEnabled: performanceSettings.perfEnabled,
    buildBaronSettings: {
      ticketCreateProject: buildBaronSettings.customTicket
        ? null
        : buildBaronSettings.ticketCreateProject,
      ticketSearchProjects: buildBaronSettings.ticketSearchProjects
        .map(({ searchProject }) => searchProject)
        .filter((str) => !!str),
    },
    taskAnnotationSettings: {
      fileTicketWebhook: buildBaronSettings.customTicket
        ? null
        : {
            endpoint: taskAnnotationSettings.fileTicketWebhook.endpoint,
            secret: taskAnnotationSettings.fileTicketWebhook.secret,
          },
      jiraCustomFields: buildBaronSettings.customTicket
        ? null
        : taskAnnotationSettings.jiraCustomFields.map(
            ({ field, displayText }) => ({ field, displayText })
          ),
    },
  };

  return { projectRef };
};
