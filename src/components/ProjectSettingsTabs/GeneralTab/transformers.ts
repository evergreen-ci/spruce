import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

export const gqlToForm: GqlToFormFunction = (data): FormState => {
  if (!data) return null;

  const { projectRef } = data;
  return {
    generalConfiguration: {
      enabled: projectRef.enabled,
      repositoryInfo: {
        owner: projectRef.owner,
        repo: projectRef.repo,
      },
      branch: projectRef.branch,
      other: {
        displayName: projectRef.displayName,
        batchTime: projectRef.batchTime,
        remotePath: projectRef.remotePath,
        spawnHostScriptPath: projectRef.spawnHostScriptPath,
      },
    },
    projectFlags: {
      dispatchingDisabled: projectRef.dispatchingDisabled,
      scheduling: {
        deactivatePrevious: projectRef.deactivatePrevious,
      },
      repotracker: {
        repotrackerDisabled: projectRef.repotrackerDisabled,
      },
      logger: {
        defaultLogger:
          projectRef.defaultLogger === "" ? null : projectRef.defaultLogger,
      },
      testResults: {
        cedarTestResultsEnabled: projectRef.cedarTestResultsEnabled,
      },
      patch: {
        patchingDisabled: projectRef.patchingDisabled,
      },
      taskSync: {
        configEnabled: projectRef.taskSync.configEnabled,
        patchEnabled: projectRef.taskSync.patchEnabled,
      },
    },
    historicalDataCaching: {
      disabledStatsCache: projectRef.disabledStatsCache,
      files: {
        filesIgnoredFromCache: projectRef.filesIgnoredFromCache
          ? projectRef.filesIgnoredFromCache.map((filePattern) => ({
              filePattern,
            }))
          : null,
      },
    },
  };
};

export const formToGql: FormToGqlFunction = (
  { generalConfiguration, projectFlags, historicalDataCaching }: FormState,
  id
) => {
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
  };

  return { projectRef };
};
