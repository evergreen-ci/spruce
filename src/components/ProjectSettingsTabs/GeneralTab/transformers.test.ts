import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { ProjectVariant } from "../utils";
import { formToGql, gqlToForm } from "./transformers";
import { FormState } from "./types";

const { projectBase, repoBase } = data;

describe("repo data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(
      gqlToForm(repoBase, { projectVariant: ProjectVariant.Repo })
    ).toStrictEqual(repoForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(repoForm, "repo")).toStrictEqual(repoResult);
  });
});

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(
      gqlToForm(projectBase, { projectVariant: ProjectVariant.AttachedProject })
    ).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
  });
});

const repoForm: FormState = {
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
      filesIgnoredFromCacheOverride: true,
      filesIgnoredFromCache: ["filename"],
    },
  },
};

const repoResult: Pick<RepoSettingsInput, "projectRef"> = {
  projectRef: {
    id: "repo",
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
  },
};

const projectForm: FormState = {
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
      filesIgnoredFromCacheOverride: false,
      filesIgnoredFromCache: [],
    },
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef"> = {
  projectRef: {
    id: "project",

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
  },
};
