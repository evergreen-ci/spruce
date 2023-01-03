import { ProjectType } from "../utils";

export interface FormState {
  generalConfiguration: {
    enabled: boolean | null;
    repositoryInfo: {
      owner: string;
      repo: string;
    };
    branch: string;
    other: {
      displayName: string;
      identifier?: string;
      batchTime: number;
      remotePath: string;
      spawnHostScriptPath: string;
      versionControlEnabled: boolean | null;
    };
  };
  projectFlags: {
    dispatchingDisabled: boolean | null;
    scheduling: {
      deactivatePrevious: boolean | null;
      stepbackDisabled: boolean | null;
      deactivateStepback: null;
    };
    repotracker: {
      repotrackerDisabled: boolean | null;
      forceRun: null;
    };
    patch: {
      patchingDisabled: boolean | null;
    };
    taskSync: {
      configEnabled: boolean | null;
      patchEnabled: boolean | null;
    };
  };
  historicalTaskDataCaching: {
    disabledStatsCache: boolean | null;
  };
}

export type TabProps = {
  projectData?: FormState;
  projectId?: string;
  projectType: ProjectType;
  repoData?: FormState;
};
