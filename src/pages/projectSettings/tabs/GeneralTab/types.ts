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
      deactivateStepback: null;
    };
    repotracker: {
      repotrackerDisabled: boolean | null;
      forceRun: null;
    };
    logger: {
      defaultLogger: string;
    };
    testResults: {
      cedarTestResultsEnabled: boolean | null;
    };
    patch: {
      patchingDisabled: boolean | null;
    };
    taskSync: {
      configEnabled: boolean | null;
      patchEnabled: boolean | null;
    };
  };
  historicalDataCaching: {
    disabledStatsCache: boolean | null;
    files: {
      filesIgnoredFromCacheOverride: boolean;
      filesIgnoredFromCache: Array<string> | null;
    };
  };
}

export type TabProps = {
  projectData?: FormState;
  projectId?: string;
  projectType: ProjectType;
  repoData?: FormState;
  validDefaultLoggers: string[];
};
