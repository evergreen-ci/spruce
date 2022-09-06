import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { ProjectType } from "../utils";
import { formToGql, gqlToForm } from "./transformers";
import { FormState } from "./types";

const { projectBase, repoBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(
      gqlToForm(projectBase, { projectType: ProjectType.AttachedProject })
    ).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL and omits empty strings", () => {
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
  });
});

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

const projectForm: FormState = {
  containerSizeDefinitionsOverride: true,
  containerSizeDefinitions: [],
};

const projectResult: Pick<ProjectSettingsInput, "projectRef"> = {
  projectRef: {
    id: "project",
    containerSizeDefinitions: [],
  },
};

const repoForm: FormState = {
  containerSizeDefinitionsOverride: true,
  containerSizeDefinitions: [
    {
      name: "size1",
      cpu: 1,
      memoryMb: 1024,
    },
    {
      name: "size2",
      cpu: 2,
      memoryMb: 2048,
    },
  ],
};

const repoResult: Pick<RepoSettingsInput, "projectRef"> = {
  projectRef: {
    id: "repo",
    containerSizeDefinitions: [
      {
        name: "size1",
        cpu: 1,
        memoryMb: 1024,
      },
      {
        name: "size2",
        cpu: 2,
        memoryMb: 2048,
      },
    ],
  },
};
