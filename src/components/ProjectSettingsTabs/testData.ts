import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";

export const projectBase: ProjectSettingsQuery["projectSettings"] = {
  projectRef: {
    id: "project",
    repoRefId: "repo",
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
    validDefaultLoggers: ["evergreen", "buildlogger"],
    private: null,
    restricted: true,
    admins: [],
    perfEnabled: null,
    buildBaronSettings: {
      ticketCreateProject: null,
      ticketSearchProjects: [],
    },
    taskAnnotationSettings: {
      jiraCustomFields: [],
      fileTicketWebhook: {
        endpoint: null,
        secret: null,
      },
    },
  },
  vars: {
    vars: { test_name: "test_value" },
    privateVars: ["test_name"],
  },
};

const repoBase: RepoSettingsQuery["repoSettings"] = {
  projectRef: {
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
    validDefaultLoggers: ["evergreen", "buildlogger"],
    private: false,
    restricted: true,
    admins: ["admin"],
    perfEnabled: true,
    buildBaronSettings: {
      ticketCreateProject: "EVG",
      ticketSearchProjects: ["EVG"],
    },
    taskAnnotationSettings: {
      jiraCustomFields: [
        {
          field: "customField",
          displayText: "Custom Field",
        },
      ],
      fileTicketWebhook: {
        endpoint: "endpoint",
        secret: "secret",
      },
    },
  },
  vars: {
    vars: { repo_name: "repo_value" },
    privateVars: [],
  },
};

export const data = {
  projectBase,
  repoBase,
};
