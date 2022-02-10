import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm, mergeProjectRepo } from "./transformers";
import { FormState } from "./types";

const { projectBase, repoBase } = data;

describe("repo data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(repoBase)).toStrictEqual(repoForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(repoForm, "repo")).toStrictEqual(repoResult);
  });
});

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(projectForm);
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
    prTesting: {
      githubPrAliasesOverride: true,
      githubPrAliases: [
        {
          id: "1",
          alias: "__github",
          gitTag: "",
          remotePath: "",
          variant: ".*",
          task: ".*",
          variantTags: [],
          taskTags: [],
        },
      ],
    },
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
      gitTagAuthorizedTeamsOverride: false,
      gitTagAuthorizedTeams: [],
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
          variant: "^ubuntu1604$",
          task: "^lint$",
          remotePath: "",
          variantTags: [],
          taskTags: [],
        },
      ],
    },
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef" | "aliases"> = {
  projectRef: {
    id: "project",
    prTestingEnabled: null,
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
    prTesting: {
      githubPrAliasesOverride: true,
      githubPrAliases: [],
    },
    githubChecksEnabled: true,
    githubChecks: {
      githubCheckAliasesOverride: true,
      githubCheckAliases: [
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
    prTesting: {
      githubPrAliasesOverride: true,
      githubPrAliases: [
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
      ],
      repoData: {
        githubPrAliasesOverride: true,
        githubPrAliases: [],
      },
    },
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
            variant: "",
            task: "",
            variantTags: ["vTag"],
            taskTags: ["tTag"],
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
      gitTagAuthorizedTeamsOverride: false,
      gitTagAuthorizedTeams: [],
      repoData: {
        gitTagAuthorizedTeamsOverride: true,
        gitTagAuthorizedTeams: [],
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
          variant: "^ubuntu1604$",
          task: "^lint$",
          remotePath: "",
          variantTags: [],
          taskTags: [],
        },
      ],
      repoData: {
        commitQueueAliasesOverride: true,
        commitQueueAliases: [],
      },
    },
  },
};
