export type GeneralFormState = {
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
  disabledStatsCache: boolean | null;
  files: {
    filesIgnoredFromCache: string[] | null;
  };
};
