import {
  BannerTheme,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";

const projectBase: ProjectSettingsQuery["projectSettings"] = {
  githubWebhooksEnabled: true,
  projectRef: {
    externalLinks: [
      {
        displayName: "a link display name",
        urlTemplate: "https:/a-link-template-{version_id}.com",
      },
    ],
    banner: {
      text: "",
      theme: BannerTheme.Announcement,
    },
    id: "project",
    identifier: "project",
    repoRefId: "repo",
    enabled: false,
    owner: "evergreen-ci",
    repo: "evergreen",
    branch: null,
    containerSizeDefinitions: [
      {
        name: "default",
        cpu: 1024,
        memoryMb: 1024,
      },
    ],
    displayName: null,
    notifyOnBuildFailure: null,
    batchTime: 0,
    remotePath: null,
    spawnHostScriptPath: null,
    dispatchingDisabled: null,
    versionControlEnabled: true,
    deactivatePrevious: null,
    repotrackerDisabled: null,
    patchingDisabled: null,
    stepbackDisabled: null,
    taskSync: {
      configEnabled: null,
      patchEnabled: null,
    },
    disabledStatsCache: null,
    restricted: true,
    admins: [],
    prTestingEnabled: null,
    manualPrTestingEnabled: null,
    githubChecksEnabled: null,
    githubTriggerAliases: null,
    gitTagVersionsEnabled: null,
    gitTagAuthorizedUsers: ["privileged"],
    gitTagAuthorizedTeams: [],
    commitQueue: {
      enabled: null,
      mergeMethod: "",
      message: "",
    },
    perfEnabled: true,
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
    patchTriggerAliases: null,
    workstationConfig: {
      setupCommands: [
        {
          command: 'echo "hello spruce"',
          directory: "sophie.stadler",
        },
      ],
      gitClone: null,
    },
    triggers: [],
    periodicBuilds: [],
  },
  vars: {
    vars: { test_name: "", test_two: "val" },
    privateVars: ["test_name"],
    adminOnlyVars: ["test_name"],
  },
  aliases: [
    {
      id: "1",
      alias: "__github",
      gitTag: "",
      variant: ".*",
      task: ".*",
      remotePath: "",
      variantTags: [],
      taskTags: [],
    },
    {
      id: "3",
      alias: "__commit_queue",
      gitTag: "",
      variant: "^ubuntu1604$",
      task: "^lint$",
      remotePath: "",
      variantTags: [],
      taskTags: [],
    },
    {
      id: "5",
      alias: "__git_tag",
      gitTag: "tagName",
      variant: "",
      task: "",
      remotePath: "./evergreen.yml",
      variantTags: [],
      taskTags: [],
    },
  ],
};

const repoBase: RepoSettingsQuery["repoSettings"] = {
  githubWebhooksEnabled: true,
  projectRef: {
    externalLinks: [
      {
        displayName: "a link display name",
        urlTemplate: "https:/a-link-template-{version_id}.com",
      },
    ],
    id: "123",
    owner: "evergreen-ci",
    repo: "spruce",
    displayName: "",
    batchTime: 12,
    remotePath: "evergreen.yml",
    spawnHostScriptPath: "/test/path",
    dispatchingDisabled: true,
    versionControlEnabled: false,
    deactivatePrevious: true,
    repotrackerDisabled: false,
    notifyOnBuildFailure: false,
    patchingDisabled: false,
    stepbackDisabled: true,
    taskSync: {
      configEnabled: true,
      patchEnabled: true,
    },
    disabledStatsCache: false,
    restricted: true,
    admins: ["admin"],
    prTestingEnabled: false,
    manualPrTestingEnabled: false,
    githubChecksEnabled: true,
    githubTriggerAliases: ["alias1"],
    gitTagVersionsEnabled: false,
    gitTagAuthorizedUsers: ["admin"],
    gitTagAuthorizedTeams: [],
    commitQueue: {
      enabled: true,
      mergeMethod: "squash",
      message: "Commit Queue Message",
    },
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
    patchTriggerAliases: [
      {
        alias: "alias1",
        childProjectIdentifier: "spruce",
        taskSpecifiers: [
          {
            patchAlias: "alias2",
            taskRegex: "",
            variantRegex: "",
          },
          {
            patchAlias: "",
            taskRegex: ".*",
            variantRegex: ".*",
          },
        ],
        status: "succeeded",
        parentAsModule: "",
      },
    ],
    workstationConfig: {
      setupCommands: [],
      gitClone: true,
    },
    triggers: [
      {
        project: "spruce",
        dateCutoff: 1,
        level: "task",
        status: "succeeded",
        buildVariantRegex: ".*",
        taskRegex: ".*",
        configFile: ".evergreen.yml",
        alias: "my-alias",
      },
    ],
    periodicBuilds: [
      {
        alias: "",
        configFile: "evergreen.yml",
        id: "123",
        intervalHours: 24,
        message: "",
        nextRunTime: new Date("2022-03-30T17:07:10.942Z"),
      },
      {
        alias: "test",
        configFile: "evergreen.yml",
        id: "456",
        intervalHours: 12,
        message: "Build Message",
        nextRunTime: new Date("2022-03-30T17:07:10.942Z"),
      },
    ],
  },
  vars: {
    vars: { repo_name: "repo_value" },
    privateVars: [],
    adminOnlyVars: [],
  },
  aliases: [
    {
      id: "2",
      alias: "__github_checks",
      gitTag: "",
      variant: "",
      task: "",
      remotePath: "",
      variantTags: ["vTag"],
      taskTags: ["tTag"],
    },
    {
      id: "4",
      alias: "my alias name",
      gitTag: "",
      variant: "",
      task: "",
      remotePath: "",
      variantTags: ["okay"],
      taskTags: ["hi"],
    },
  ],
};

export const data = {
  projectBase,
  repoBase,
};
