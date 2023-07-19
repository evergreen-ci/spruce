import { useMemo } from "react";
import { SpruceForm, ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { FormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Plugins;

export const PluginsTab: React.VFC<TabProps> = ({
  projectData,
  projectType,
  repoData,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const initialFormState = projectData || repoData;
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const { fields, schema, uiSchema } = useMemo(
    () =>
      getFormSchema(
        projectType === ProjectType.AttachedProject ? repoData : null
      ),
    [projectType, repoData]
  );

  if (!formData) return null;

  return (
    <SpruceForm
      fields={fields}
      formData={formData}
      onChange={onChange}
      schema={schema}
      validate={validate as any}
      uiSchema={uiSchema}
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
}) satisfies ValidateProps<FormState>;
