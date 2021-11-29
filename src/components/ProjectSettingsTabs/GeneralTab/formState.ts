export type GeneralFormState = {
  generalConfiguration: {
    enabled: boolean | null;
    repositoryInfo: {
      owner: string;
      repo: string;
    };
    branch: string;
    other: {
      displayName: string;
      batchTime: number;
      remotePath: string;
      spawnHostScriptPath: string;
    };
  };
  projectFlags: {
    dispatchingDisabled: boolean | null;
    scheduling: {
      deactivatePrevious: boolean | null;
    };
    repotracker: {
      repotrackerDisabled: boolean | null;
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
      filesIgnoredFromCache: string[] | null;
    };
  };
};
