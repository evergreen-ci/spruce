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
      gqlToForm(repoBase, { projectType: ProjectType.Repo })
    ).toStrictEqual(repoForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(repoForm, "repo")).toStrictEqual(repoResult);
  });
});

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(
      gqlToForm(projectBase, { projectType: ProjectType.AttachedProject })
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
  commitQueue: {
    enabled: null,
    mergeMethod: "",
    mergeQueue: MergeQueue.Evergreen,
    message: "",
    patchDefinitions: {
      commitQueueAliases: [
        {
          alias: "__commit_queue",
          description: "",
          gitTag: "",
          id: "3",
          remotePath: "",
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: "^lint$",
            taskTags: [],
          },
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: "^ubuntu1604$",
            variantTags: [],
          },
        },
      ],
      commitQueueAliasesOverride: true,
    },
  },
  github: {
    gitTagVersionsEnabled: null,
    gitTags: {
      gitTagAliases: [
        {
          alias: "__git_tag",
          description: "",
          gitTag: "tagName",
          id: "5",
          remotePath: "./evergreen.yml",
          specifier: GitTagSpecifier.ConfigFile,
          tasks: {
            specifier: VariantTaskSpecifier.Tags,
            task: "",
            taskTags: [],
          },
          variants: {
            specifier: VariantTaskSpecifier.Tags,
            variant: "",
            variantTags: [],
          },
        },
      ],
      gitTagAliasesOverride: true,
    },
    githubChecks: {
      githubCheckAliases: [],
      githubCheckAliasesOverride: false,
    },
    githubChecksEnabled: null,
    githubTriggerAliases: [],
    manualPrTestingEnabled: null,
    prTesting: {
      githubPrAliases: [
        {
          alias: "__github",
          description: "",
          gitTag: "",
          id: "1",
          remotePath: "",
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: ".*",
            taskTags: [],
          },
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: ".*",
            variantTags: [],
          },
        },
      ],
      githubPrAliasesOverride: true,
    },
    prTestingEnabled: null,
    teams: {
      gitTagAuthorizedTeams: [],
      gitTagAuthorizedTeamsOverride: true,
    },
    users: {
      gitTagAuthorizedUsers: ["privileged"],
      gitTagAuthorizedUsersOverride: true,
    },
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef" | "aliases"> = {
  aliases: [
    {
      alias: "__github",
      description: "",
      gitTag: "",
      id: "1",
      remotePath: "",
      task: ".*",
      taskTags: [],
      variant: ".*",
      variantTags: [],
    },
    {
      alias: "__git_tag",
      description: "",
      gitTag: "tagName",
      id: "5",
      remotePath: "./evergreen.yml",
      task: "",
      taskTags: [],
      variant: "",
      variantTags: [],
    },
    {
      alias: "__commit_queue",
      description: "",
      gitTag: "",
      id: "3",
      remotePath: "",
      task: "^lint$",
      taskTags: [],
      variant: "^ubuntu1604$",
      variantTags: [],
    },
  ],
  projectRef: {
    commitQueue: {
      enabled: null,
      mergeMethod: "",
      mergeQueue: MergeQueue.Evergreen,
      message: "",
    },
    gitTagAuthorizedTeams: [],
    gitTagAuthorizedUsers: ["privileged"],
    gitTagVersionsEnabled: null,
    githubChecksEnabled: null,
    id: "project",
    manualPrTestingEnabled: null,
    prTestingEnabled: null,
  },
};

const repoForm: GCQFormState = {
  commitQueue: {
    enabled: true,
    mergeMethod: "squash",
    mergeQueue: MergeQueue.Github,
    message: "Commit Queue Message",
    patchDefinitions: {
      commitQueueAliases: [],
      commitQueueAliasesOverride: true,
    },
  },
  github: {
    gitTagVersionsEnabled: false,
    gitTags: {
      gitTagAliases: [],
      gitTagAliasesOverride: true,
    },
    githubChecks: {
      githubCheckAliases: [
        {
          alias: "__github_checks",
          description: "",
          gitTag: "",
          id: "2",
          remotePath: "",
          tasks: {
            specifier: VariantTaskSpecifier.Tags,
            task: "",
            taskTags: ["tTag"],
          },
          variants: {
            specifier: VariantTaskSpecifier.Tags,
            variant: "",
            variantTags: ["vTag"],
          },
        },
      ],
      githubCheckAliasesOverride: true,
    },
    githubChecksEnabled: true,
    githubTriggerAliases: [
      {
        alias: "alias1",
        childProjectIdentifier: "spruce",
        parentAsModule: "",
        status: "succeeded",
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
      },
    ],
    manualPrTestingEnabled: false,
    prTesting: {
      githubPrAliases: [],
      githubPrAliasesOverride: true,
    },
    prTestingEnabled: false,
    teams: {
      gitTagAuthorizedTeams: [],
      gitTagAuthorizedTeamsOverride: true,
    },
    users: {
      gitTagAuthorizedUsers: ["admin"],
      gitTagAuthorizedUsersOverride: true,
    },
  },
};

const repoResult: Pick<RepoSettingsInput, "projectRef" | "aliases"> = {
  aliases: [
    {
      alias: "__github_checks",
      description: "",
      gitTag: "",
      id: "2",
      remotePath: "",
      task: "",
      taskTags: ["tTag"],
      variant: "",
      variantTags: ["vTag"],
    },
  ],
  projectRef: {
    commitQueue: {
      enabled: true,
      mergeMethod: "squash",
      mergeQueue: MergeQueue.Github,
      message: "Commit Queue Message",
    },
    gitTagAuthorizedTeams: [],
    gitTagAuthorizedUsers: ["admin"],
    gitTagVersionsEnabled: false,
    githubChecksEnabled: true,
    id: "repo",
    manualPrTestingEnabled: false,
    prTestingEnabled: false,
  },
};

const mergedForm: GCQFormState = {
  commitQueue: {
    enabled: null,
    mergeMethod: "",
    mergeQueue: MergeQueue.Evergreen,
    message: "",
    patchDefinitions: {
      commitQueueAliases: [
        {
          alias: "__commit_queue",
          description: "",
          gitTag: "",
          id: "3",
          remotePath: "",
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: "^lint$",
            taskTags: [],
          },
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: "^ubuntu1604$",
            variantTags: [],
          },
        },
      ],
      commitQueueAliasesOverride: true,
      repoData: {
        commitQueueAliases: [],
        commitQueueAliasesOverride: true,
      },
    },
  },
  github: {
    gitTagVersionsEnabled: null,
    gitTags: {
      gitTagAliases: [
        {
          alias: "__git_tag",
          description: "",
          gitTag: "tagName",
          id: "5",
          remotePath: "./evergreen.yml",
          specifier: GitTagSpecifier.ConfigFile,
          tasks: {
            specifier: VariantTaskSpecifier.Tags,
            task: "",
            taskTags: [],
          },
          variants: {
            specifier: VariantTaskSpecifier.Tags,
            variant: "",
            variantTags: [],
          },
        },
      ],
      gitTagAliasesOverride: true,
      repoData: {
        gitTagAliases: [],
        gitTagAliasesOverride: true,
      },
    },
    githubChecks: {
      githubCheckAliases: [],
      githubCheckAliasesOverride: false,
      repoData: {
        githubCheckAliases: [
          {
            alias: "__github_checks",
            description: "",
            gitTag: "",
            id: "2",
            remotePath: "",
            tasks: {
              specifier: VariantTaskSpecifier.Tags,
              task: "",
              taskTags: ["tTag"],
            },
            variants: {
              specifier: VariantTaskSpecifier.Tags,
              variant: "",
              variantTags: ["vTag"],
            },
          },
        ],
        githubCheckAliasesOverride: true,
      },
    },
    githubChecksEnabled: null,
    githubTriggerAliases: [],
    manualPrTestingEnabled: null,
    prTesting: {
      githubPrAliases: [
        {
          alias: "__github",
          description: "",
          gitTag: "",
          id: "1",
          remotePath: "",
          tasks: {
            specifier: VariantTaskSpecifier.Regex,
            task: ".*",
            taskTags: [],
          },
          variants: {
            specifier: VariantTaskSpecifier.Regex,
            variant: ".*",
            variantTags: [],
          },
        },
      ],
      githubPrAliasesOverride: true,
      repoData: {
        githubPrAliases: [],
        githubPrAliasesOverride: true,
      },
    },
    prTestingEnabled: null,
    teams: {
      gitTagAuthorizedTeams: [],
      gitTagAuthorizedTeamsOverride: true,
      repoData: {
        gitTagAuthorizedTeams: [],
        gitTagAuthorizedTeamsOverride: true,
      },
    },
    users: {
      gitTagAuthorizedUsers: ["privileged"],
      gitTagAuthorizedUsersOverride: true,
      repoData: {
        gitTagAuthorizedUsers: ["admin"],
        gitTagAuthorizedUsersOverride: true,
      },
    },
  },
};
