import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Containers;

const getInitialFormState = (projectData, repoData) => {
  if (!projectData) return repoData;
  if (repoData) {
    return {
      ...projectData,
      ...repoData,
    };
  }
  return projectData;
};

export const ContainersTab: React.VFC<TabProps> = ({
  projectData,
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

  const { fields, schema, uiSchema } = useMemo(() => getFormSchema(), []);

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
