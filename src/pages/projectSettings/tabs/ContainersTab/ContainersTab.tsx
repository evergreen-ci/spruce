import { useMemo } from "react";
import Banner from "@leafygreen-ui/banner";
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

  const { providers } = useSpruceConfig() || {};
  const { aws } = providers || {};
  const { pod } = aws || {};
  const { ecs } = pod || {};
  const onChange = updateForm(tab);

  const { fields, schema, uiSchema } = useMemo(() => getFormSchema(ecs), [ecs]);

  if (!formData || !ecs) return null;

  return (
    <>
      <Banner variant="warning">
        Running tasks on containers is currently in beta, and is only available
        to a select group of initial candidates. If you have any questions about
        container tasks or are interested in exploring how this feature could
        benefit your project, please reach out to us in #evergreen-users
      </Banner>
      <SpruceForm
        fields={fields}
        formData={formData}
        onChange={onChange}
        schema={schema}
        uiSchema={uiSchema}
      />
    </>
  );
};
