import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ValidateProps } from "components/SpruceForm/types";
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
const validate: ValidateProps<FormState> = (formData, errors) => {
  const {
    buildBaronSettings: { ticketSearchProjects },
    externalLinks: { patchMetadataPanelLink },
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

  const displayNameDefined = !!patchMetadataPanelLink.displayName.trim();
  const urlTemplateDefined = !!patchMetadataPanelLink.urlTemplate.trim();
  if (displayNameDefined && !urlTemplateDefined) {
    errors.externalLinks.patchMetadataPanelLink.urlTemplate.addError(
      "You must specify a URL template or exclude display name."
    );
  } else if (!displayNameDefined && urlTemplateDefined) {
    errors.externalLinks.patchMetadataPanelLink.displayName.addError(
      "You must specify a display name or exclude URL template."
    );
  }
  if (patchMetadataPanelLink.displayName.length > 40) {
    errors.externalLinks.patchMetadataPanelLink.displayName.addError(
      "Display name must be less than 40 characters."
    );
  }
  return errors;
};
