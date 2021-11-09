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

const gqlToSchema = ({
  owner,
  repo,
  branch,
  displayName,
  batchTime,
  remotePath,
  spawnHostScriptPath,
  defaultLogger,
  taskSync,
  ...data
}:
  | ProjectGeneralSettingsFragment
  | RepoGeneralSettingsFragment): FormState => ({
  enabled: data.enabled,
  repositoryInfo: {
    owner,
    repo,
  },
  branch,
  other: {
    displayName,
    batchTime,
    remotePath,
    spawnHostScriptPath,
  },
  dispatchingDisabled: data.dispatchingDisabled,
  scheduling: {
    deactivatePrevious: data.deactivatePrevious,
  },
  repotracker: {
    repotrackerDisabled: data.repotrackerDisabled,
  },
  logger: {
    defaultLogger,
  },
  testResults: {
    cedarTestResultsEnabled: data.cedarTestResultsEnabled,
  },
  patch: {
    patchingDisabled: data.patchingDisabled,
  },
  taskSync: {
    configEnabled: taskSync.configEnabled,
    patchEnabled: taskSync.patchEnabled,
  },
  disabledStatsCache: data.disabledStatsCache,
  files: {
    filesIgnoredFromCache: data.filesIgnoredFromCache,
  },
});

interface FormState {
  enabled: boolean | null;
  repositoryInfo: {
    owner: string;
    repo: string;
  };
  branch: string;
  other: {
    displayName: string;
    batchTime: number;
    remotePath: string;
    spawnHostScriptPath: string;
  };
  dispatchingDisabled: boolean | null;
  scheduling: {
    deactivatePrevious: boolean | null;
  };
  repotracker: {
    repotrackerDisabled: boolean | null;
  };
  logger: {
    defaultLogger: string;
  };
  testResults: {
    cedarTestResultsEnabled: boolean | null;
  };
  patch: {
    patchingDisabled: boolean | null;
  };
  taskSync: {
    configEnabled: boolean | null;
    patchEnabled: boolean | null;
  };
  disabledStatsCache: boolean | null;
  files: {
    filesIgnoredFromCache: string[] | null;
  };
}
