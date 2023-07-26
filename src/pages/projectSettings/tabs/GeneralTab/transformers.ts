import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";

type Tab = ProjectSettingsTabRoutes.General;

export const gqlToForm = ((data, options = {}) => {
  if (!data) return null;
  const projectType = options.projectType ?? ProjectType.Project;
  const { projectRef } = data;

  return {
    generalConfiguration: {
      ...(projectType !== ProjectType.Repo &&
        "enabled" in projectRef && {
          enabled: projectRef.enabled,
        }),
      repositoryInfo: {
        owner: projectRef.owner,
        repo: projectRef.repo,
      },
      ...(projectType !== ProjectType.Repo &&
        "branch" in projectRef && {
          branch: projectRef.branch,
        }),
      other: {
        displayName: projectRef.displayName,
        ...(projectType !== ProjectType.Repo &&
          "identifier" in projectRef && {
            identifier: projectRef.identifier,
          }),
        batchTime: projectRef.batchTime || null,
        remotePath: projectRef.remotePath,
        spawnHostScriptPath: projectRef.spawnHostScriptPath,
        versionControlEnabled: projectRef.versionControlEnabled,
      },
    },
    historicalTaskDataCaching: {
      disabledStatsCache: projectRef.disabledStatsCache,
    },
    projectFlags: {
      dispatchingDisabled: projectRef.dispatchingDisabled,
      patch: {
        patchingDisabled: projectRef.patchingDisabled,
      },
      repotracker: {
        forceRun: null,
        repotrackerDisabled: projectRef.repotrackerDisabled,
      },
      scheduling: {
        deactivatePrevious: projectRef.deactivatePrevious,
        deactivateStepback: null,
        stepbackDisabled: projectRef.stepbackDisabled,
      },
      taskSync: {
        configEnabled: projectRef.taskSync.configEnabled,
        patchEnabled: projectRef.taskSync.patchEnabled,
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  {
    generalConfiguration,
    historicalTaskDataCaching: { disabledStatsCache },
    projectFlags,
  },
  id
) => {
  const projectRef: ProjectInput = {
    id,
    ...("enabled" in generalConfiguration && {
      enabled: generalConfiguration.enabled,
    }),
    owner: generalConfiguration.repositoryInfo.owner,
    repo: generalConfiguration.repositoryInfo.repo,
    ...("branch" in generalConfiguration && {
      branch: generalConfiguration.branch,
    }),
    displayName: generalConfiguration.other.displayName,
    ...(generalConfiguration.other.identifier && {
      identifier: generalConfiguration.other.identifier,
    }),
    batchTime: generalConfiguration.other.batchTime ?? 0,
    deactivatePrevious: projectFlags.scheduling.deactivatePrevious,
    disabledStatsCache,
    dispatchingDisabled: projectFlags.dispatchingDisabled,
    patchingDisabled: projectFlags.patch.patchingDisabled,
    remotePath: generalConfiguration.other.remotePath,
    repotrackerDisabled: projectFlags.repotracker.repotrackerDisabled,
    spawnHostScriptPath: generalConfiguration.other.spawnHostScriptPath,
    stepbackDisabled: projectFlags.scheduling.stepbackDisabled,
    taskSync: {
      configEnabled: projectFlags.taskSync.configEnabled,
      patchEnabled: projectFlags.taskSync.patchEnabled,
    },
    versionControlEnabled: generalConfiguration.other.versionControlEnabled,
  };

  return { projectRef };
}) satisfies FormToGqlFunction<Tab>;
