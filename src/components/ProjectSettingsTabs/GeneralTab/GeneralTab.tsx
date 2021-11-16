import { useCallback, useMemo } from "react";
import { SpruceForm, SpruceFormContainer } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "context/project-settings";
import { gqlToForm, TabProps } from ".";
import { getFormData } from "./getFormData";

const tab = ProjectSettingsTabRoutes.General;

export const GeneralTab: React.FC<TabProps> = ({
  projectData,
  projectId,
  repoData,
  useRepoSettings,
}) => {
  const { getTabFormState, updateForm } = useProjectSettingsContext();
  const currentFormState = getTabFormState(tab);

  const initialFormState = useMemo(() => gqlToForm(projectData || repoData), [
    projectData,
    repoData,
  ]);
  usePopulateForm(initialFormState, tab);

  const onChange = useCallback(({ formData }) => updateForm(tab, formData), [
    updateForm,
  ]);

  const validDefaultLoggers =
    projectData?.validDefaultLoggers || repoData?.validDefaultLoggers;

  const {
    generalConfiguration,
    projectFlags,
    historicalDataCaching,
  } = useMemo(
    () =>
      getFormData(
        projectId,
        useRepoSettings,
        validDefaultLoggers,
        useRepoSettings ? repoData : null
      ),
    [projectId, repoData, useRepoSettings, validDefaultLoggers]
  );

  if (!currentFormState) return null;

  return (
    <>
      <SpruceFormContainer title="General Configuration">
        <SpruceForm
          fields={generalConfiguration.fields}
          formData={currentFormState}
          onChange={onChange}
          schema={generalConfiguration.schema}
          uiSchema={generalConfiguration.uiSchema}
        />
      </SpruceFormContainer>
      <SpruceFormContainer title="Project Flags">
        <SpruceForm
          fields={projectFlags.fields}
          formData={currentFormState}
          onChange={onChange}
          schema={projectFlags.schema}
          uiSchema={projectFlags.uiSchema}
        />
      </SpruceFormContainer>
      <SpruceFormContainer title="Historical Data Caching Info">
        <SpruceForm
          fields={historicalDataCaching.fields}
          formData={currentFormState}
          onChange={onChange}
          schema={historicalDataCaching.schema}
          uiSchema={historicalDataCaching.uiSchema}
        />
      </SpruceFormContainer>
    </>
  );
};
