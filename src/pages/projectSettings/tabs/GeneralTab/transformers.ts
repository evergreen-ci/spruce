import {
  ProjectInput,
  ProjectSettingsInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";
import { FormState } from "./types";

export const gqlToForm: GqlToFormFunction<FormState> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  options: { projectType: ProjectType }
): ReturnType<GqlToFormFunction> => {
  if (!data) return null;

  const { projectRef } = data;
  const { projectType } = options;

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
        ...("identifier" in projectRef && {
          identifier: projectRef?.identifier,
        }),
        batchTime: projectRef.batchTime || null,
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
        filesIgnoredFromCacheOverride:
          projectType !== ProjectType.AttachedProject ||
          !!projectRef.filesIgnoredFromCache?.length,
        filesIgnoredFromCache: projectRef.filesIgnoredFromCache ?? [],
      },
    },
  };
};

export const formToGql: FormToGqlFunction = (
  {
    generalConfiguration,
    projectFlags,
    historicalDataCaching: {
      disabledStatsCache,
      files: { filesIgnoredFromCache, filesIgnoredFromCacheOverride },
    },
  }: FormState,
  id: string
): Pick<ProjectSettingsInput, "projectRef"> => {
  const filteredFiles = filesIgnoredFromCache.filter((file) => file);
  const projectRef: ProjectInput = {
    id,
    enabled: generalConfiguration.enabled,
    owner: generalConfiguration.repositoryInfo.owner,
    repo: generalConfiguration.repositoryInfo.repo,
    branch: generalConfiguration.branch,
    displayName: generalConfiguration.other.displayName,
    identifier: generalConfiguration.other.identifier,
    batchTime: generalConfiguration.other.batchTime ?? 0,
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
    disabledStatsCache,
    filesIgnoredFromCache:
      filesIgnoredFromCacheOverride && filteredFiles.length
        ? filteredFiles
        : null,
  };

  return { projectRef };
};
