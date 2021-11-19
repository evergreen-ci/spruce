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
  generalConfiguration: {
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
  },
  projectFlags: {
    dispatchingDisabled: data.dispatchingDisabled,
    scheduling: {
      deactivatePrevious: data.deactivatePrevious,
    },
    repotracker: {
      repotrackerDisabled: data.repotrackerDisabled,
    },
    logger: {
      defaultLogger: data.defaultLogger === "" ? null : data.defaultLogger,
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
  },
  historicalDataCaching: {
    disabledStatsCache: data.disabledStatsCache,
    files: {
      filesIgnoredFromCache: data.filesIgnoredFromCache
        ? data.filesIgnoredFromCache.map((filePattern) => ({ filePattern }))
        : null,
    },
  },
});

export const formToGql = (
  { generalConfiguration, projectFlags, historicalDataCaching }: FormState,
  id: string,
  useRepoSettings?: boolean
): Pick<ProjectSettingsInput, "projectRef"> => {
  const filteredFiles =
    historicalDataCaching?.files?.filesIgnoredFromCache
      ?.map(({ filePattern }) => filePattern)
      .filter((str) => !!str) || [];
  const projectRef: ProjectInput = {
    id,
    enabled: generalConfiguration.enabled,
    owner: generalConfiguration.repositoryInfo.owner,
    repo: generalConfiguration.repositoryInfo.repo,
    branch: generalConfiguration.branch,
    displayName: generalConfiguration.other.displayName,
    batchTime: generalConfiguration.other.batchTime,
    remotePath: generalConfiguration.other.remotePath,
    spawnHostScriptPath: generalConfiguration.other.spawnHostScriptPath,
    dispatchingDisabled: projectFlags.dispatchingDisabled,
    deactivatePrevious: projectFlags.scheduling.deactivatePrevious,
    repotrackerDisabled: projectFlags.repotracker.repotrackerDisabled,
    defaultLogger: projectFlags.logger.defaultLogger,
    cedarTestResultsEnabled: projectFlags.testResults.cedarTestResultsEnabled,
    patchingDisabled: projectFlags.patch.patchingDisabled,
    taskSync: {
      configEnabled: projectFlags.taskSync.configEnabled,
      patchEnabled: projectFlags.taskSync.patchEnabled,
    },
    disabledStatsCache: historicalDataCaching.disabledStatsCache,
    filesIgnoredFromCache: filteredFiles.length ? filteredFiles : null,
    ...(useRepoSettings !== undefined && { useRepoSettings }),
  };

  return { projectRef };
};
