import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.Plugins;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { projectRef } = data;
  return {
    buildBaronSettings: {
      taskAnnotationSettings: {
        jiraCustomFields:
          projectRef?.taskAnnotationSettings?.jiraCustomFields?.map(
            ({ displayText, field }) => ({
              displayText,
              field,
            })
          ) ?? [],
      },
      ticketSearchProjects:
        projectRef?.buildBaronSettings?.ticketSearchProjects?.map(
          (searchProject) => ({ searchProject })
        ) ?? [],
      useBuildBaron:
        projectRef?.taskAnnotationSettings?.fileTicketWebhook?.endpoint === "",

      fileTicketWebhook: {
        endpoint:
          projectRef?.taskAnnotationSettings?.fileTicketWebhook?.endpoint,
        secret: projectRef?.taskAnnotationSettings?.fileTicketWebhook?.secret,
      },
      ticketCreateProject: {
        createProject: projectRef?.buildBaronSettings?.ticketCreateProject,
      },
    },
    externalLinks: {
      metadataPanelLink: {
        displayName: projectRef?.externalLinks?.[0].displayName ?? "",
        requesters: projectRef?.externalLinks?.[0].requesters ?? [],
        urlTemplate: projectRef?.externalLinks?.[0].urlTemplate ?? "",
      },
    },
    performanceSettings: {
      perfEnabled: projectRef?.perfEnabled,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { buildBaronSettings, externalLinks, performanceSettings },
  id
) => {
  const projectRef: ProjectInput = {
    id,
    perfEnabled: performanceSettings.perfEnabled,
    ...buildBaronIf(buildBaronSettings.useBuildBaron, buildBaronSettings),
    externalLinks: [externalLinks.metadataPanelLink],
    taskAnnotationSettings: {
      ...fileTicketWebhookIf(
        buildBaronSettings.useBuildBaron,
        buildBaronSettings.fileTicketWebhook
      ),
      jiraCustomFields:
        buildBaronSettings.taskAnnotationSettings?.jiraCustomFields
          .map(({ displayText, field }) => ({ displayText, field }))
          .filter((str) => !!str),
    },
  };

  return { projectRef };
}) satisfies FormToGqlFunction<Tab>;

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
