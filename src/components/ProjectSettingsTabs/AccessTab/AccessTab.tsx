import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { TabProps } from ".";
import { usePopulateForm, useProjectSettingsContext } from "../Context";
import { getFormData } from "./getFormData";

const tab = ProjectSettingsTabRoutes.Access;

export const AccessTab: React.FC<TabProps> = ({
  projectData,
  repoData,
  useRepoSettings,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const initialFormState = useMemo(() => projectData || repoData, [
    projectData,
    repoData,
  ]);
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const { fields, schema, uiSchema } = useMemo(
    () => getFormData(useRepoSettings, useRepoSettings ? repoData : null),
    [repoData, useRepoSettings]
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
