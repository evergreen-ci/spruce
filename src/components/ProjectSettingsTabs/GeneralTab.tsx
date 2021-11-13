import { useCallback, useMemo } from "react";
import { SpruceForm, SpruceFormContainer } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "context/project-settings";
import {
  ProjectGeneralSettingsFragment,
  RepoGeneralSettingsFragment,
} from "gql/generated/types";
import { GeneralFormState } from "./GeneralTab/formState";
import { getFormData } from "./GeneralTab/getFormData";
import { GeneralTabProps } from "./types";

const tab = ProjectSettingsTabRoutes.General;

export const GeneralTab: React.FC<GeneralTabProps> = ({
  projectData,
  projectId,
  repoData,
  useRepoSettings,
}) => {
  const { getTabFormState, updateForm } = useProjectSettingsContext();
  const currentFormState = getTabFormState(tab);

  const initialFormState = useMemo(() => gqlToSchema(projectData || repoData), [
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

const gqlToSchema = (
  data: ProjectGeneralSettingsFragment | RepoGeneralSettingsFragment
): GeneralFormState => ({
  enabled: data.enabled,
  repositoryInfo: {
    owner: data.owner,
    repo: data.repo,
  },
  branch: data.branch,
  other: {
    displayName: data.displayName,
    batchTime: data.batchTime,
    remotePath: data.remotePath,
    spawnHostScriptPath: data.spawnHostScriptPath,
  },
  dispatchingDisabled: data.dispatchingDisabled,
  scheduling: {
    deactivatePrevious: data.deactivatePrevious,
  },
  repotracker: {
    repotrackerDisabled: data.repotrackerDisabled,
  },
  logger: {
    defaultLogger: data.defaultLogger,
  },
  testResults: {
    cedarTestResultsEnabled: data.cedarTestResultsEnabled,
  },
  patch: {
    patchingDisabled: data.patchingDisabled,
  },
  taskSync: {
    configEnabled: data.taskSync.configEnabled,
    patchEnabled: data.taskSync.patchEnabled,
  },
  disabledStatsCache: data.disabledStatsCache,
  files: {
    filesIgnoredFromCache: data.filesIgnoredFromCache,
  },
});
