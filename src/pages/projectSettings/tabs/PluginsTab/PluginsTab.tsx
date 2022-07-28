import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

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
    [projectType, repoData, formData]
  );

  if (!formData) return null;

  return (
    <SpruceForm
      fields={fields}
      formData={formData}
      onChange={onChange}
      schema={schema}
      validate={validate}
      uiSchema={uiSchema}
    />
  );
};

/* Display an error and prevent saving if a user enters something invalid. */
const validate = (formData, errors) => {
  const searchProject = formData?.buildBaronSettings?.ticketSearchProjects;

  // if a search project is defined, a create project must be defined, and vice versa
  const searchProjectDefined = searchProject?.length !== 0;

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

  return errors;
};
