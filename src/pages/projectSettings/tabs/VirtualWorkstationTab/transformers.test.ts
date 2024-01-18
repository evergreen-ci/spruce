import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { ProjectType } from "../utils";
import { formToGql, gqlToForm } from "./transformers";
import { VWFormState } from "./types";

const { projectBase, repoBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(
      gqlToForm(projectBase, { projectType: ProjectType.AttachedProject }),
    ).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL and omits empty strings", () => {
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
  });
});

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

const projectForm: VWFormState = {
  gitClone: null,
  commands: {
    setupCommandsOverride: true,
    setupCommands: [
      {
        command: 'echo "hello spruce"',
        directory: "sophie.stadler",
      },
    ],
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef"> = {
  projectRef: {
    id: "project",
    workstationConfig: {
      gitClone: null,
      setupCommands: [
        {
          command: 'echo "hello spruce"',
          directory: "sophie.stadler",
        },
      ],
    },
  },
};

const repoForm: VWFormState = {
  gitClone: true,
  commands: {
    setupCommandsOverride: true,
    setupCommands: [],
  },
};

const repoResult: Pick<RepoSettingsInput, "projectRef"> = {
  projectRef: {
    id: "repo",
    workstationConfig: {
      gitClone: true,
      setupCommands: [],
    },
  },
};
