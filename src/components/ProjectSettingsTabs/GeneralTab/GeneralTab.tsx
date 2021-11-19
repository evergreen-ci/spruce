import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { gqlToForm, TabProps } from ".";
import { usePopulateForm, useProjectSettingsContext } from "../Context";
import { getFormData } from "./getFormData";

const tab = ProjectSettingsTabRoutes.General;

export const GeneralTab: React.FC<TabProps> = ({
  projectData,
  projectId,
  repoData,
  useRepoSettings,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const initialFormState = useMemo(() => gqlToForm(projectData || repoData), [
    projectData,
    repoData,
  ]);
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const validDefaultLoggers =
    projectData?.validDefaultLoggers || repoData?.validDefaultLoggers;

  const { fields, schema, uiSchema } = useMemo(
    () =>
      getFormData(
        projectId,
        useRepoSettings,
        validDefaultLoggers,
        useRepoSettings ? repoData : null
      ),
    [projectId, repoData, useRepoSettings, validDefaultLoggers]
  );

  if (!formData) return null;

  return (
    <SpruceForm
      fields={fields}
      formData={formData}
      onChange={onChange}
      schema={schema}
      uiSchema={uiSchema}
    />
  );
};
