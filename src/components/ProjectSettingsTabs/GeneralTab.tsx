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

// While most boolean fields specify whether a property is enabled, some if a field is *disabled*.
// These values need to be switched in order to display properties to users in a consistent manner.
// This function also preserves the null state of a field.
const invertValue = (val) => (val === null ? null : !val);

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
  | RepoGeneralSettingsFragment): GeneralSettingsFormState<void> => ({
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
  dispatchingDisabled: invertValue(data.dispatchingDisabled),
  scheduling: {
    deactivatePrevious: data.deactivatePrevious,
  },
  repotracker: {
    repotrackerDisabled: invertValue(data.repotrackerDisabled),
  },
  logger: {
    defaultLogger,
  },
  testResults: {
    cedarTestResultsEnabled: data.cedarTestResultsEnabled,
  },
  patch: {
    patchingDisabled: invertValue(data.patchingDisabled),
  },
  taskSync: {
    configEnabled: taskSync.configEnabled,
    patchEnabled: taskSync.patchEnabled,
  },
  disabledStatsCache: invertValue(data.disabledStatsCache),
  files: {
    filesIgnoredFromCache: data.filesIgnoredFromCache,
  },
});

interface GeneralSettingsFormState<T> {
  enabled: boolean | null | T;
  repositoryInfo: {
    owner: string | T;
    repo: string | T;
  };
  branch: string | T;
  other: {
    displayName: string | T;
    batchTime: number | T;
    remotePath: string | T;
    spawnHostScriptPath: string | T;
  };
  dispatchingDisabled: boolean | null | T;
  scheduling: {
    deactivatePrevious: boolean | null | T;
  };
  repotracker: {
    repotrackerDisabled: boolean | null | T;
  };
  logger: {
    defaultLogger: string | T;
  };
  testResults: {
    cedarTestResultsEnabled: boolean | null | T;
  };
  patch: {
    patchingDisabled: boolean | null | T;
  };
  taskSync: {
    configEnabled: boolean | null | T;
    patchEnabled: boolean | null | T;
  };
  disabledStatsCache: boolean | null | T;
  files: {
    filesIgnoredFromCache: string[] | null | T;
  };
}
