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

const tab = ProjectSettingsTabRoutes.Variables;

const getInitialFormState = (projectData, repoData) => {
  if (!projectData) return repoData;
  if (repoData) return { ...projectData, repoData };
  return projectData;
};

export const VariablesTab: React.VFC<TabProps> = ({
  projectData,
  projectType,
  repoData,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData]
  );
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const { fields, schema, uiSchema } = useMemo(
    () =>
      getFormSchema(
        projectType,
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
      uiSchema={uiSchema}
      validate={validate}
      customFormats={{ "not-empty-string": /([^\s])/ }}
    />
  );
};

/* Display an error and prevent saving if a user enters a variable name that already appears in the project. */
const validate = (formData, errors) => {
  const duplicateIndices = formData.vars
    .map((e) => e.varName)
    .map((e, i, arr) => arr.indexOf(e) !== i && i)
    .filter((obj) => formData.vars[obj]);

  duplicateIndices.forEach((i) => {
    errors.vars?.[i]?.varName?.addError(
      "Value already appears in project variables."
    );
  });

  return errors;
};
