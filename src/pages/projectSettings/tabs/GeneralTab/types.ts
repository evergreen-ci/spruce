import { ProjectType } from "../utils";

export interface GeneralFormState {
  generalConfiguration: {
    enabled?: boolean;
    repositoryInfo: {
      owner: string;
      repo: string;
    };
    branch?: string;
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
      stepbackBisection: boolean | null;
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
  projectData?: GeneralFormState;
  projectId?: string;
  projectType: ProjectType;
  repoData?: GeneralFormState;
};
