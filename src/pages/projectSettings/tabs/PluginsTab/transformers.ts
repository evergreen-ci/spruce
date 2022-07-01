import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

type Tab = ProjectSettingsTabRoutes.Plugins;

export const gqlToForm: GqlToFormFunction<Tab> = (data) => {
  if (!data) return null;

  const { projectRef } = data;
  return {
    performanceSettings: {
      perfEnabled: projectRef?.perfEnabled,
    },
    buildBaronSettings: {
      taskAnnotationSettings: {
        jiraCustomFields:
          projectRef?.taskAnnotationSettings?.jiraCustomFields?.map(
            ({ field, displayText }) => ({
              field,
              displayText,
            })
          ) ?? [],
      },
      useBuildBaron:
        projectRef?.taskAnnotationSettings?.fileTicketWebhook?.endpoint === "",
      ticketSearchProjects:
        projectRef?.buildBaronSettings?.ticketSearchProjects?.map(
          (searchProject) => ({ searchProject })
        ) ?? [],

      ticketCreateProject: {
        createProject: projectRef?.buildBaronSettings?.ticketCreateProject,
      },
      fileTicketWebhook: {
        endpoint:
          projectRef?.taskAnnotationSettings?.fileTicketWebhook?.endpoint,
        secret: projectRef?.taskAnnotationSettings?.fileTicketWebhook?.secret,
      },
    },
  };
};

export const formToGql: FormToGqlFunction<Tab> = (
  { performanceSettings, buildBaronSettings }: FormState,
  id: string
) => {
  const projectRef: ProjectInput = {
    id,
    perfEnabled: performanceSettings.perfEnabled,
    ...buildBaronIf(buildBaronSettings.useBuildBaron, buildBaronSettings),
    taskAnnotationSettings: {
      ...fileTicketWebhookIf(
        buildBaronSettings.useBuildBaron,
        buildBaronSettings.fileTicketWebhook
      ),
      jiraCustomFields: buildBaronSettings.taskAnnotationSettings?.jiraCustomFields
        .map(({ field, displayText }) => ({ field, displayText }))
        .filter((str) => !!str),
    },
  };

  return { projectRef };
};

// conditionally include the buildBaronSettings field based on the useBuildBaron boolean
export const buildBaronIf = (useBuildBaron: boolean, buildBaronSettings: any) =>
  useBuildBaron === true &&
  buildBaronSettings !== undefined && {
    buildBaronSettings: {
      ticketCreateProject:
        buildBaronSettings.ticketCreateProject?.createProject,
      ticketSearchProjects: buildBaronSettings.ticketSearchProjects
        .map(({ searchProject }) => searchProject)
        .filter((str) => !!str),
    },
  };

// conditionally include the fileTicketWebhook field based on the useBuildBaron boolean
export const fileTicketWebhookIf = (
  useBuildBaron: boolean,
  fileTicketWebhook: any
) =>
  useBuildBaron !== true &&
  fileTicketWebhook !== undefined && {
    fileTicketWebhook: {
      endpoint: fileTicketWebhook.endpoint,
      secret: fileTicketWebhook.secret,
    },
  };
