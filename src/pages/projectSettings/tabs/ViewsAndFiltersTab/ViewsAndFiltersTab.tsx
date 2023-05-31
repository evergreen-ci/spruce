import { useMemo } from "react";
import { SpruceForm, ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { getFormSchema } from "./getFormSchema";
import { TabProps, FormState } from "./types";

const tab = ProjectSettingsTabRoutes.ViewsAndFilters;

export const ViewsAndFiltersTab: React.VFC<TabProps> = ({ projectData }) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const initialFormState = projectData;
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const { fields, schema, uiSchema } = useMemo(() => getFormSchema(), []);

  if (!formData) return null;

  return (
    <SpruceForm
      fields={fields}
      formData={formData}
      onChange={onChange}
      schema={schema}
      uiSchema={uiSchema}
      validate={validate as any}
    />
  );
};

/* Display an error and prevent saving if a user enters a Parsley filter expression that already appears in the project. */
const validate = ((formData, errors) => {
  const duplicateIndices = formData.parsleyFilters
    .map((p) => p.expression)
    .map((exp, i, arr) => exp !== "" && arr.lastIndexOf(exp) !== i && i)
    .filter((i) => formData.parsleyFilters[i]);

  duplicateIndices.forEach((i) => {
    errors.parsleyFilters?.[i]?.expression?.addError(
      "Filter expression already appears in this project."
    );
  });

  return errors;
}) satisfies ValidateProps<FormState>;
