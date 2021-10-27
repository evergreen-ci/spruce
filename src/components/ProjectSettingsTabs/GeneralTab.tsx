import { useCallback, useMemo } from "react";
import { SpruceForm, SpruceFormContainer } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "context/project-settings";
import { getFormData } from "./GeneralTab/getFormData";
import { GeneralTabProps } from "./types";

const tab = ProjectSettingsTabRoutes.General;

export const GeneralTab: React.FC<GeneralTabProps> = ({
  data,
  useRepoSettings,
}) => {
  const { getTabFormState, updateForm } = useProjectSettingsContext();
  const currentFormState = getTabFormState(tab);

  const initialFormState = useMemo(() => gqlToSchema(data), [data]);
  usePopulateForm(initialFormState, tab);

  const onChange = useCallback(({ formData }) => updateForm(tab, formData), [
    updateForm,
  ]);

  const {
    generalConfiguration,
    projectFlags,
    historicalDataCaching,
  } = useMemo(() => getFormData(useRepoSettings), [useRepoSettings]);

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
  enabled = false,
  owner,
  repo,
  branch,
  displayName,
  batchTime = 0,
  remotePath,
  spawnHostScriptPath,
  dispatchingDisabled = false,
  deactivatePrevious = true,
  repotrackerDisabled = false,
  defaultLogger = "",
  cedarTestResultsEnabled = false,
  patchingDisabled = false,
  taskSync,
  disabledStatsCache = false,
  filesIgnoredFromCache = [],
}) => ({
  enabled: enabled ? "enabled" : "disabled",
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
  dispatchingDisabled: dispatchingDisabled ? "disabled" : "enabled",
  scheduling: {
    deactivatePrevious: deactivatePrevious ? "unschedule" : "schedule",
  },
  repotracker: {
    repotrackerDisabled: repotrackerDisabled ? "disabled" : "enabled",
    // TODO: Fetch forceRepotrackerRun via resolver
    forceRepotrackerRun: false,
  },
  logger: {
    defaultLogger: defaultLogger || null,
  },
  testResults: {
    cedarTestResultsEnabled: cedarTestResultsEnabled ? "enabled" : "disabled",
  },
  patch: {
    patchingDisabled: patchingDisabled ? "disabled" : "enabled",
  },
  taskSync: {
    configEnabled: taskSync.configEnabled ? "enabled" : "disabled",
    patchEnabled: taskSync.patchEnabled ? "enabled" : "disabled",
  },
  disabledStatsCache: disabledStatsCache ? "disabledStatsCache" : "enabled",
  filesIgnoredFromCache,
});
