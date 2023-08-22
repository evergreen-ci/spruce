import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
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

  const formSchema = useMemo(
    () =>
      getFormSchema(
        projectType === ProjectType.AttachedProject ? repoData : null
      ),
    [projectType, repoData]
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
    externalLinks: { metadataPanelLink },
  } = formData;

  // if a search project is defined, a create project must be defined, and vice versa
  const searchProjectDefined = !!ticketSearchProjects.length;

  const createProjectDefined =
    formData?.buildBaronSettings?.ticketCreateProject?.createProject.trim() !==
    "";

  if (searchProjectDefined && !createProjectDefined) {
    errors.buildBaronSettings?.ticketCreateProject?.createProject.addError(
      "You must specify a create project."
    );
  }

  if (createProjectDefined && !searchProjectDefined) {
    errors.buildBaronSettings?.ticketCreateProject?.createProject.addError(
      "You must also specify at least one ticket search project above."
    );
  }

  const displayNameDefined = metadataPanelLink.displayName.trim() !== "";
  const urlTemplateDefined = metadataPanelLink.urlTemplate.trim() !== "";
  const requestersDefined = metadataPanelLink.requesters.length > 0;

  if (displayNameDefined || urlTemplateDefined || requestersDefined) {
    if (!displayNameDefined) {
      errors.externalLinks.metadataPanelLink.displayName.addError(
        "You must specify a display name."
      );
    }
    if (!urlTemplateDefined) {
      errors.externalLinks.metadataPanelLink.urlTemplate.addError(
        "You must specify a URL template."
      );
    }
    if (!requestersDefined) {
      errors.externalLinks.metadataPanelLink.requesters.addError(
        "You must specify requesters."
      );
    }
  }

  return errors;
}) satisfies ValidateProps<PluginsFormState>;
