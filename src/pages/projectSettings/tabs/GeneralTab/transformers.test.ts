import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { ProjectType } from "../utils";
import { formToGql, gqlToForm } from "./transformers";
import { GeneralFormState } from "./types";

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
    expect(gqlToForm(projectBase)).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
  });
});

const repoForm: GeneralFormState = {
  generalConfiguration: {
    other: {
      batchTime: 12,
      displayName: "",
      remotePath: "evergreen.yml",
      spawnHostScriptPath: "/test/path",
      versionControlEnabled: false,
    },
    repositoryInfo: {
      owner: "evergreen-ci",
      repo: "spruce",
    },
  },
  historicalTaskDataCaching: {
    disabledStatsCache: false,
  },
  projectFlags: {
    dispatchingDisabled: true,
    patch: {
      patchingDisabled: false,
    },
    repotracker: {
      forceRun: null,
      repotrackerDisabled: false,
    },
    scheduling: {
      deactivatePrevious: true,
      deactivateStepback: null,
      stepbackDisabled: true,
    },
    taskSync: {
      configEnabled: true,
      patchEnabled: true,
    },
  },
};

const repoResult: Pick<RepoSettingsInput, "projectRef"> = {
  projectRef: {
    batchTime: 12,
    deactivatePrevious: true,
    disabledStatsCache: false,
    dispatchingDisabled: true,
    displayName: "",
    id: "repo",
    owner: "evergreen-ci",
    patchingDisabled: false,
    remotePath: "evergreen.yml",
    repo: "spruce",
    repotrackerDisabled: false,
    spawnHostScriptPath: "/test/path",
    stepbackDisabled: true,
    taskSync: {
      configEnabled: true,
      patchEnabled: true,
    },
    versionControlEnabled: false,
  },
};

const projectForm: GeneralFormState = {
  generalConfiguration: {
    branch: null,
    enabled: false,
    other: {
      batchTime: null,
      displayName: null,
      identifier: "project",
      remotePath: null,
      spawnHostScriptPath: null,
      versionControlEnabled: true,
    },
    repositoryInfo: {
      owner: "evergreen-ci",
      repo: "evergreen",
    },
  },
  historicalTaskDataCaching: {
    disabledStatsCache: null,
  },
  projectFlags: {
    dispatchingDisabled: null,
    patch: {
      patchingDisabled: null,
    },
    repotracker: {
      forceRun: null,
      repotrackerDisabled: null,
    },
    scheduling: {
      deactivatePrevious: null,
      deactivateStepback: null,
      stepbackDisabled: null,
    },
    taskSync: {
      configEnabled: null,
      patchEnabled: null,
    },
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef"> = {
  projectRef: {
    batchTime: 0,
    branch: null,
    deactivatePrevious: null,
    disabledStatsCache: null,
    dispatchingDisabled: null,
    displayName: null,
    enabled: false,
    id: "project",
    identifier: "project",
    owner: "evergreen-ci",
    patchingDisabled: null,
    remotePath: null,
    repo: "evergreen",
    repotrackerDisabled: null,
    spawnHostScriptPath: null,
    stepbackDisabled: null,
    taskSync: {
      configEnabled: null,
      patchEnabled: null,
    },
    versionControlEnabled: true,
  },
};
