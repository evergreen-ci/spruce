import {
  ProjectGeneralSettingsFragment,
  ProjectInput,
  ProjectSettingsInput,
  RepoGeneralSettingsFragment,
} from "gql/generated/types";
import { FormState } from "./types";

export const gqlToForm = (
  data: ProjectGeneralSettingsFragment | RepoGeneralSettingsFragment
): FormState => ({
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
    filesIgnoredFromCache: data.filesIgnoredFromCache
      ? data.filesIgnoredFromCache.map((filePattern) => ({ filePattern }))
      : null,
  },
});

export const formToGql = (
  formState: FormState,
  id: string,
  useRepoSettings: boolean
): Pick<ProjectSettingsInput, "projectRef"> => {
  const filteredFiles =
    formState?.files?.filesIgnoredFromCache
      ?.map(({ filePattern }) => filePattern)
      .filter((str) => !!str) || [];
  const projectRef: ProjectInput = {
    id,
    enabled: formState.enabled,
    owner: formState.repositoryInfo.owner,
    repo: formState.repositoryInfo.repo,
    branch: formState.branch,
    displayName: formState.other.displayName,
    batchTime: formState.other.batchTime,
    remotePath: formState.other.remotePath,
    spawnHostScriptPath: formState.other.spawnHostScriptPath,
    dispatchingDisabled: formState.dispatchingDisabled,
    deactivatePrevious: formState.scheduling.deactivatePrevious,
    repotrackerDisabled: formState.repotracker.repotrackerDisabled,
    defaultLogger: formState.logger.defaultLogger,
    cedarTestResultsEnabled: formState.testResults.cedarTestResultsEnabled,
    patchingDisabled: formState.patch.patchingDisabled,
    taskSync: {
      configEnabled: formState.taskSync.configEnabled,
      patchEnabled: formState.taskSync.patchEnabled,
    },
    disabledStatsCache: formState.disabledStatsCache,
    filesIgnoredFromCache: filteredFiles.length ? filteredFiles : null,
    useRepoSettings,
  };

  return { projectRef };
};
