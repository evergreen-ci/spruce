import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { usePopulateForm, useProjectSettingsContext } from "../Context";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Notifications;

export const NotificationsTab: React.FC<TabProps> = ({
  projectData,
  repoData,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const initialFormState = projectData || repoData;
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const { fields, schema, uiSchema } = useMemo(() => getFormSchema(repoData), [
    repoData,
  ]);
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
