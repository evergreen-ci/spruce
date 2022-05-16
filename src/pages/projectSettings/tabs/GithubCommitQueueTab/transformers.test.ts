import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { alias, ProjectType } from "../utils";
import { formToGql, gqlToForm, mergeProjectRepo } from "./transformers";
import { FormState } from "./types";

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

const projectForm: FormState = {
  github: {
    prTestingEnabled: null,
    manualPrTestingEnabled: null,
    prTesting: {
      githubPrAliasesOverride: true,
      githubPrAliases: [
        {
          id: "1",
          alias: "__github",
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
        },
      ],
    },
  },
  commitQueue: {
    enabled: null,
    requireSigned: null,
    mergeMethod: "",
    message: "",
    patchDefinitions: {
      commitQueueAliasesOverride: true,
      commitQueueAliases: [
        {
          id: "3",
          alias: "__commit_queue",
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
      requireSigned: null,
      mergeMethod: "",
      message: "",
    },
  },
  aliases: [
    {
      id: "1",
      alias: "__github",
      gitTag: "",
      remotePath: "",
      task: ".*",
      taskTags: [],
      variant: ".*",
      variantTags: [],
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
  ],
};

const repoForm: FormState = {
  github: {
    prTestingEnabled: true,
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
        status: "succeeded",
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
        },
      ],
    },
    gitTagVersionsEnabled: true,
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
    requireSigned: true,
    mergeMethod: "squash",
    message: "Commit Queue Message",
    patchDefinitions: {
      commitQueueAliasesOverride: true,
      commitQueueAliases: [],
    },
  },
};

const repoResult: Pick<RepoSettingsInput, "projectRef" | "aliases"> = {
  projectRef: {
    id: "repo",
    prTestingEnabled: true,
    manualPrTestingEnabled: false,
    githubChecksEnabled: true,
    gitTagVersionsEnabled: true,
    gitTagAuthorizedUsers: ["admin"],
    gitTagAuthorizedTeams: [],
    commitQueue: {
      enabled: true,
      requireSigned: true,
      mergeMethod: "squash",
      message: "Commit Queue Message",
    },
  },
  aliases: [
    {
      id: "2",
      alias: "__github_checks",
      gitTag: "",
      remotePath: "",
      task: "",
      taskTags: ["tTag"],
      variant: "",
      variantTags: ["vTag"],
    },
  ],
};

const mergedForm: FormState = {
  github: {
    prTestingEnabled: null,
    manualPrTestingEnabled: null,
    prTesting: {
      githubPrAliasesOverride: true,
      githubPrAliases: [
        {
          id: "1",
          alias: "__github",
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
    requireSigned: null,
    mergeMethod: "",
    message: "",
    patchDefinitions: {
      commitQueueAliasesOverride: true,
      commitQueueAliases: [
        {
          id: "3",
          alias: "__commit_queue",
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
        },
      ],
      repoData: {
        commitQueueAliasesOverride: true,
        commitQueueAliases: [],
      },
    },
  },
};
