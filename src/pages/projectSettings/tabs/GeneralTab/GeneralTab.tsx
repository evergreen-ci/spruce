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

const tab = ProjectSettingsTabRoutes.General;

export const GeneralTab: React.FC<TabProps> = ({
  projectData,
  projectId,
  projectType,
  repoData,
  validDefaultLoggers,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData, initialData } = getTab(tab);

  const initialFormState = projectData || repoData;
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const identifierHasChanges = useMemo(
    () =>
      initialData?.projectRef?.identifier !==
      formData?.generalConfiguration?.other?.identifier,
    [
      initialData?.projectRef?.identifier,
      formData?.generalConfiguration?.other?.identifier,
    ]
  );
  const { fields, schema, uiSchema } = useMemo(
    () =>
      getFormSchema(
        projectId,
        projectType,
        validDefaultLoggers,
        identifierHasChanges,
        projectType === ProjectType.AttachedProject ? repoData : null
      ),
    [
      identifierHasChanges,
      projectId,
      projectType,
      repoData,
      validDefaultLoggers,
    ]
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
