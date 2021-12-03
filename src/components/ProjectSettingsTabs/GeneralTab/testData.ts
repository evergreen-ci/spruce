import {
  ProjectGeneralSettingsFragment,
  ProjectSettingsInput,
  RepoGeneralSettingsFragment,
  RepoSettingsInput,
} from "gql/generated/types";
import { FormState } from "./types";

const repoGqlBase = {
  id: "123",
  enabled: true,
  owner: "evergreen-ci",
  repo: "spruce",
  branch: "main",
  displayName: "",
  batchTime: 0,
  remotePath: "evergreen.yml",
  spawnHostScriptPath: "/test/path",
  dispatchingDisabled: true,
  deactivatePrevious: true,
  repotrackerDisabled: false,
  defaultLogger: "buildlogger",
  cedarTestResultsEnabled: false,
  patchingDisabled: false,
  taskSync: {
    configEnabled: true,
    patchEnabled: true,
  },
  disabledStatsCache: false,
  filesIgnoredFromCache: ["filename"],
};

const repoGqlInput: {
  [projectRef: string]: {
    id: string;
  } & RepoGeneralSettingsFragment;
} = {
  projectRef: {
    ...repoGqlBase,
    validDefaultLoggers: ["evergreen", "buildlogger"],
  },
};

const repoGqlResult: Partial<RepoSettingsInput> = {
  projectRef: {
    ...repoGqlBase,
  },
};

const repoFormData: FormState = {
  generalConfiguration: {
    enabled: true,
    repositoryInfo: {
      owner: "evergreen-ci",
      repo: "spruce",
    },
    branch: "main",
    other: {
      displayName: "",
      batchTime: 0,
      remotePath: "evergreen.yml",
      spawnHostScriptPath: "/test/path",
    },
  },
  projectFlags: {
    dispatchingDisabled: true,
    scheduling: {
      deactivatePrevious: true,
    },
    repotracker: {
      repotrackerDisabled: false,
    },
    logger: {
      defaultLogger: "buildlogger",
    },
    testResults: {
      cedarTestResultsEnabled: false,
    },
    patch: {
      patchingDisabled: false,
    },
    taskSync: {
      configEnabled: true,
      patchEnabled: true,
    },
  },
  historicalDataCaching: {
    disabledStatsCache: false,
    files: {
      filesIgnoredFromCache: [
        {
          filePattern: "filename",
        },
      ],
    },
  },
};

const projectGqlBase = {
  id: "456",
  useRepoSettings: true,

  enabled: null,
  owner: "evergreen-ci",
  repo: "evergreen",
  branch: null,
  displayName: null,
  batchTime: 0,
  remotePath: null,
  spawnHostScriptPath: null,
  dispatchingDisabled: null,
  deactivatePrevious: null,
  repotrackerDisabled: null,
  defaultLogger: null,
  cedarTestResultsEnabled: null,
  patchingDisabled: null,
  taskSync: {
    configEnabled: null,
    patchEnabled: null,
  },
  disabledStatsCache: null,
  filesIgnoredFromCache: null,
};

const projectGqlInput: {
  [projectRef: string]: {
    id: string;
  } & ProjectGeneralSettingsFragment;
} = {
  projectRef: {
    ...projectGqlBase,
    validDefaultLoggers: ["evergreen", "buildlogger"],
  },
};

const projectGqlResult: Partial<ProjectSettingsInput> = {
  projectRef: {
    ...projectGqlBase,
    useRepoSettings: true,
  },
};

const projectFormData: FormState = {
  generalConfiguration: {
    enabled: null,
    repositoryInfo: {
      owner: "evergreen-ci",
      repo: "evergreen",
    },
    branch: null,
    other: {
      displayName: null,
      batchTime: 0,
      remotePath: null,
      spawnHostScriptPath: null,
    },
  },
  projectFlags: {
    dispatchingDisabled: null,
    scheduling: {
      deactivatePrevious: null,
    },
    repotracker: {
      repotrackerDisabled: null,
    },
    logger: {
      defaultLogger: null,
    },
    testResults: {
      cedarTestResultsEnabled: null,
    },
    patch: {
      patchingDisabled: null,
    },
    taskSync: {
      configEnabled: null,
      patchEnabled: null,
    },
  },
  historicalDataCaching: {
    disabledStatsCache: null,
    files: {
      filesIgnoredFromCache: null,
    },
  },
};

const data = {
  project: {
    gql: {
      input: projectGqlInput,
      result: projectGqlResult,
    },
    form: projectFormData,
  },
  repo: {
    gql: {
      input: repoGqlInput,
      result: repoGqlResult,
    },
    form: repoFormData,
  },
};

export { data };
