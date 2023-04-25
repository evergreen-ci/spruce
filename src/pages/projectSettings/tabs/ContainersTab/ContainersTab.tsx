import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useSpruceConfig } from "hooks";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Containers;

export const ContainersTab: React.VFC<TabProps> = ({
  projectData,
  repoData,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);
  const initialFormState = projectData || repoData;
  usePopulateForm(initialFormState, tab);

  const { providers } = useSpruceConfig();
  const { aws } = providers || {};
  const { pod } = aws || {};
  const { ecs } = pod || {};
  const onChange = updateForm(tab);

  const { fields, schema, uiSchema } = useMemo(() => getFormSchema(ecs), [ecs]);

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
