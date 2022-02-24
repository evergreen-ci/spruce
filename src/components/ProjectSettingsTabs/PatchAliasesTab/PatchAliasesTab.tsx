import { useMemo } from "react";
import { SpruceForm, SpruceFormProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { usePopulateForm, useProjectSettingsContext } from "../Context";
import { alias } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { FormState, TabProps } from "./types";

const { aliasHasError } = alias;

const tab = ProjectSettingsTabRoutes.PatchAliases;

const getInitialFormState = (projectData, repoData) => {
  if (!projectData) return repoData;
  if (repoData) {
    return {
      patchAliases: {
        ...projectData.patchAliases,
        repoData: repoData.patchAliases,
      },
    };
  }
  return projectData;
};

export const PatchAliasesTab: React.FC<TabProps> = ({
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
    () => getFormSchema(projectType),
    [projectType]
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
    />
  );
};

const validate = (
  formData: FormState,
  errors
): ReturnType<SpruceFormProps["validate"]> => {
  const { patchAliases } = formData;

  patchAliases.aliases.forEach((a, i) => {
    if (aliasHasError(a) || !a.alias) {
      errors.patchAliases.aliases[i].addError("Missing field");
    }
  });

  return errors;
};
