import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.General;

export const gqlToForm: GqlToFormFunction<Tab> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"]
) => {
  if (!data) return null;

  const { projectRef } = data;

  return {
    generalConfiguration: {
      ...("enabled" in projectRef && {
        enabled: projectRef.enabled,
      }),
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
        versionControlEnabled: projectRef.versionControlEnabled,
      },
    },
    projectFlags: {
      dispatchingDisabled: projectRef.dispatchingDisabled,
      scheduling: {
        deactivatePrevious: projectRef.deactivatePrevious,
        stepbackDisabled: projectRef.stepbackDisabled,
        deactivateStepback: null,
      },
      repotracker: {
        repotrackerDisabled: projectRef.repotrackerDisabled,
        forceRun: null,
      },
      patch: {
        patchingDisabled: projectRef.patchingDisabled,
      },
      taskSync: {
        configEnabled: projectRef.taskSync.configEnabled,
        patchEnabled: projectRef.taskSync.patchEnabled,
      },
    },
    historicalTaskDataCaching: {
      disabledStatsCache: projectRef.disabledStatsCache,
    },
  };
};

export const formToGql: FormToGqlFunction<Tab> = (
  {
    generalConfiguration,
    projectFlags,
    historicalTaskDataCaching: { disabledStatsCache },
  },
  id: string
) => {
  const projectRef: ProjectInput = {
    id,
    ...(generalConfiguration.enabled && {
      enabled: generalConfiguration.enabled,
    }),
    owner: generalConfiguration.repositoryInfo.owner,
    repo: generalConfiguration.repositoryInfo.repo,
    branch: generalConfiguration.branch,
    displayName: generalConfiguration.other.displayName,
    ...(generalConfiguration.other.identifier && {
      identifier: generalConfiguration.other.identifier,
    }),
    batchTime: generalConfiguration.other.batchTime ?? 0,
    remotePath: generalConfiguration.other.remotePath,
    spawnHostScriptPath: generalConfiguration.other.spawnHostScriptPath,
    versionControlEnabled: generalConfiguration.other.versionControlEnabled,
    dispatchingDisabled: projectFlags.dispatchingDisabled,
    deactivatePrevious: projectFlags.scheduling.deactivatePrevious,
    repotrackerDisabled: projectFlags.repotracker.repotrackerDisabled,
    stepbackDisabled: projectFlags.scheduling.stepbackDisabled,
    patchingDisabled: projectFlags.patch.patchingDisabled,
    taskSync: {
      configEnabled: projectFlags.taskSync.configEnabled,
      patchEnabled: projectFlags.taskSync.patchEnabled,
    },
    disabledStatsCache,
  };

  return { projectRef };
};
