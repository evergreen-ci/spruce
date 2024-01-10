import {
  ProjectSettingsInput,
  RepoSettingsInput,
  MergeQueue,
} from "gql/generated/types";
import { data } from "../testData";
import { alias, ProjectType } from "../utils";
import { formToGql, gqlToForm, mergeProjectRepo } from "./transformers";
import { GCQFormState } from "./types";

const { GitTagSpecifier, VariantTaskSpecifier } = alias;
const { projectBase, repoBase } = data;

describe("repo data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(
      gqlToForm(repoBase, { projectType: ProjectType.Repo }),
    ).toStrictEqual(repoForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(repoForm, "repo")).toStrictEqual(repoResult);
  });
});

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(
      gqlToForm(projectBase, { projectType: ProjectType.AttachedProject }),
    ).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL and omits empty strings", () => {
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
  });

  it("correctly merges project and repo form states", () => {
    expect(mergeProjectRepo(projectForm, repoForm)).toStrictEqual(mergedForm);
  });
});

const projectForm: GCQFormState = {
  github: {
    prTestingEnabled: null,
    manualPrTestingEnabled: null,
    prTesting: {
      githubPrAliasesOverride: true,
      githubPrAliases: [
        {
          id: "1",
          alias: "__github",
          description: "",
          gitTag: "",
          remotePath: "",
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: ".*",
            variantTags: [],
          },
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: ".*",
            taskTags: [],
          },
          parameters: [],
        },
      ],
    },
    githubTriggerAliases: [],
    githubChecksEnabled: null,
    githubChecks: {
      githubCheckAliasesOverride: false,
      githubCheckAliases: [],
    },
    gitTagVersionsEnabled: null,
    users: {
      gitTagAuthorizedUsersOverride: true,
      gitTagAuthorizedUsers: ["privileged"],
    },
    teams: {
      gitTagAuthorizedTeamsOverride: true,
      gitTagAuthorizedTeams: [],
    },
    gitTags: {
      gitTagAliasesOverride: true,
      gitTagAliases: [
        {
          id: "5",
          alias: "__git_tag",
          description: "",
          specifier: GitTagSpecifier.ConfigFile,
          remotePath: "./evergreen.yml",
          gitTag: "tagName",
          variants: {
            specifier: VariantTaskSpecifier.Tags,
            variant: "",
            variantTags: [],
          },
          tasks: {
            specifier: VariantTaskSpecifier.Tags,
            task: "",
            taskTags: [],
          },
          parameters: [],
        },
      ],
    },
  },
  commitQueue: {
    enabled: null,
    message: "",
    mergeSettings: {
      mergeMethod: "",
      mergeQueue: MergeQueue.Evergreen,
    },
    patchDefinitions: {
      commitQueueAliasesOverride: true,
      commitQueueAliases: [
        {
          id: "3",
          alias: "__commit_queue",
          description: "",
          gitTag: "",
          remotePath: "",
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: "^ubuntu1604$",
            variantTags: [],
          },
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: "^lint$",
            taskTags: [],
          },
          parameters: [],
        },
      ],
    },
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef" | "aliases"> = {
  projectRef: {
    id: "project",
    prTestingEnabled: null,
    manualPrTestingEnabled: null,
    githubChecksEnabled: null,
    gitTagVersionsEnabled: null,
    gitTagAuthorizedUsers: ["privileged"],
    gitTagAuthorizedTeams: [],
    commitQueue: {
      enabled: null,
      message: "",
      mergeMethod: "",
      mergeQueue: MergeQueue.Evergreen,
    },
  },
  aliases: [
    {
      id: "1",
      alias: "__github",
      description: "",
      gitTag: "",
      remotePath: "",
      task: ".*",
      taskTags: [],
      variant: ".*",
      variantTags: [],
      parameters: [],
    },
    {
      id: "5",
      alias: "__git_tag",
      description: "",
      gitTag: "tagName",
      variant: "",
      task: "",
      remotePath: "./evergreen.yml",
      variantTags: [],
      taskTags: [],
      parameters: [],
    },
    {
      id: "3",
      alias: "__commit_queue",
      description: "",
      gitTag: "",
      variant: "^ubuntu1604$",
      task: "^lint$",
      remotePath: "",
      variantTags: [],
      taskTags: [],
      parameters: [],
    },
  ],
};

const repoForm: GCQFormState = {
  github: {
    prTestingEnabled: false,
    manualPrTestingEnabled: false,
    prTesting: {
      githubPrAliasesOverride: true,
      githubPrAliases: [],
    },
    githubTriggerAliases: [
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
        status: "success",
        parentAsModule: "",
      },
    ],
    githubChecksEnabled: true,
    githubChecks: {
      githubCheckAliasesOverride: true,
      githubCheckAliases: [
        {
          id: "2",
          alias: "__github_checks",
          description: "",
          gitTag: "",
          remotePath: "",
          variants: {
            specifier: VariantTaskSpecifier.Tags,
            variant: "",
            variantTags: ["vTag"],
          },
          tasks: {
            specifier: VariantTaskSpecifier.Tags,
            task: "",
            taskTags: ["tTag"],
          },
          parameters: [],
        },
      ],
    },
    gitTagVersionsEnabled: false,
    users: {
      gitTagAuthorizedUsersOverride: true,
      gitTagAuthorizedUsers: ["admin"],
    },
    teams: {
      gitTagAuthorizedTeamsOverride: true,
      gitTagAuthorizedTeams: [],
    },
    gitTags: {
      gitTagAliasesOverride: true,
      gitTagAliases: [],
    },
  },
  commitQueue: {
    enabled: true,
    message: "Commit Queue Message",
    mergeSettings: {
      mergeMethod: "squash",
      mergeQueue: MergeQueue.Github,
    },
    patchDefinitions: {
      commitQueueAliasesOverride: true,
      commitQueueAliases: [],
    },
  },
};

const repoResult: Pick<RepoSettingsInput, "projectRef" | "aliases"> = {
  projectRef: {
    id: "repo",
    prTestingEnabled: false,
    manualPrTestingEnabled: false,
    githubChecksEnabled: true,
    gitTagVersionsEnabled: false,
    gitTagAuthorizedUsers: ["admin"],
    gitTagAuthorizedTeams: [],
    commitQueue: {
      enabled: true,
      message: "Commit Queue Message",
      mergeMethod: "squash",
      mergeQueue: MergeQueue.Github,
    },
  },
  aliases: [
    {
      id: "2",
      alias: "__github_checks",
      description: "",
      gitTag: "",
      remotePath: "",
      task: "",
      taskTags: ["tTag"],
      variant: "",
      variantTags: ["vTag"],
      parameters: [],
    },
  ],
};

const mergedForm: GCQFormState = {
  github: {
    prTestingEnabled: null,
    manualPrTestingEnabled: null,
    prTesting: {
      githubPrAliasesOverride: true,
      githubPrAliases: [
        {
          id: "1",
          alias: "__github",
          description: "",
          gitTag: "",
          remotePath: "",
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: ".*",
            variantTags: [],
          },
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: ".*",
            taskTags: [],
          },
          parameters: [],
        },
      ],
      repoData: {
        githubPrAliasesOverride: true,
        githubPrAliases: [],
      },
    },
    githubTriggerAliases: [],
    githubChecksEnabled: null,
    githubChecks: {
      githubCheckAliasesOverride: false,
      githubCheckAliases: [],
      repoData: {
        githubCheckAliasesOverride: true,
        githubCheckAliases: [
          {
            id: "2",
            alias: "__github_checks",
            description: "",
            gitTag: "",
            remotePath: "",
            variants: {
              specifier: VariantTaskSpecifier.Tags,
              variant: "",
              variantTags: ["vTag"],
            },
            tasks: {
              specifier: VariantTaskSpecifier.Tags,
              task: "",
              taskTags: ["tTag"],
            },
            parameters: [],
          },
        ],
      },
    },
    gitTagVersionsEnabled: null,
    users: {
      gitTagAuthorizedUsersOverride: true,
      gitTagAuthorizedUsers: ["privileged"],
      repoData: {
        gitTagAuthorizedUsersOverride: true,
        gitTagAuthorizedUsers: ["admin"],
      },
    },
    teams: {
      gitTagAuthorizedTeamsOverride: true,
      gitTagAuthorizedTeams: [],
      repoData: {
        gitTagAuthorizedTeamsOverride: true,
        gitTagAuthorizedTeams: [],
      },
    },
    gitTags: {
      gitTagAliasesOverride: true,
      gitTagAliases: [
        {
          id: "5",
          alias: "__git_tag",
          description: "",
          specifier: GitTagSpecifier.ConfigFile,
          remotePath: "./evergreen.yml",
          gitTag: "tagName",
          variants: {
            specifier: VariantTaskSpecifier.Tags,
            variant: "",
            variantTags: [],
          },
          tasks: {
            specifier: VariantTaskSpecifier.Tags,
            task: "",
            taskTags: [],
          },
          parameters: [],
        },
      ],
      repoData: {
        gitTagAliasesOverride: true,
        gitTagAliases: [],
      },
    },
  },
  commitQueue: {
    enabled: null,
    message: "",
    mergeSettings: {
      mergeMethod: "",
      mergeQueue: MergeQueue.Evergreen,
    },
    patchDefinitions: {
      commitQueueAliasesOverride: true,
      commitQueueAliases: [
        {
          id: "3",
          alias: "__commit_queue",
          description: "",
          gitTag: "",
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: "^ubuntu1604$",
            variantTags: [],
          },
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: "^lint$",
            taskTags: [],
          },
          remotePath: "",
          parameters: [],
        },
      ],
      repoData: {
        commitQueueAliasesOverride: true,
        commitQueueAliases: [],
      },
    },
  },
};
