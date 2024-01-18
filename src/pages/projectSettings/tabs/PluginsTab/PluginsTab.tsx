import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useSpruceConfig } from "hooks";
import { BaseTab } from "../BaseTab";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { PluginsFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Plugins;

export const PluginsTab: React.FC<TabProps> = ({
  projectData,
  projectType,
  repoData,
}) => {
  const initialFormState = projectData || repoData;
  const spruceConfig = useSpruceConfig();
  const jiraEmail = spruceConfig?.jira?.email;

  const formSchema = useMemo(
    () =>
      getFormSchema(
        jiraEmail,
        projectType === ProjectType.AttachedProject ? repoData : null,
      ),
    [jiraEmail, projectType, repoData],
  );

  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
      validate={validate}
    />
  );
};

/* Display an error and prevent saving if a user enters something invalid. */
const validate = ((formData, errors) => {
  const {
    buildBaronSettings: { ticketSearchProjects },
    externalLinks,
  } = formData;

  // if a search project is defined, a create project must be defined, and vice versa
  const searchProjectDefined = !!ticketSearchProjects.length;

  const createProjectDefined =
    formData?.buildBaronSettings?.ticketCreateProject?.createProject.trim() !==
    "";

  if (searchProjectDefined && !createProjectDefined) {
    errors.buildBaronSettings?.ticketCreateProject?.createProject.addError(
      "You must specify a create project.",
    );
  }

  if (createProjectDefined && !searchProjectDefined) {
    errors.buildBaronSettings?.ticketCreateProject?.createProject.addError(
      "You must also specify at least one ticket search project above.",
    );
  }

  externalLinks.forEach((link, idx) => {
    const displayNameDefined = link.displayName.trim() !== "";
    const urlTemplateDefined = link.urlTemplate.trim() !== "";
    const requestersDefined = link.requesters.length > 0;

    if (displayNameDefined || urlTemplateDefined || requestersDefined) {
      if (!displayNameDefined) {
        errors.externalLinks[idx].displayName.addError(
          "You must specify a display name.",
        );
      }
      if (!urlTemplateDefined) {
        errors.externalLinks[idx].urlTemplate.addError(
          "You must specify a URL template.",
        );
      }
      if (!requestersDefined) {
        errors.externalLinks[idx].requesters.addError(
          "You must specify requesters.",
        );
      }
    }
  });

  return errors;
}) satisfies ValidateProps<PluginsFormState>;
