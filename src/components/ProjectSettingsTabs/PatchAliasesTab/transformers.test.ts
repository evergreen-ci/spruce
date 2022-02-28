import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { ProjectType } from "../utils";
import { formToGql, gqlToForm } from "./transformers";
import { FormState } from "./types";

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
});

const projectForm: FormState = {
  patchAliases: {
    aliasesOverride: false,
    aliases: [],
  },
  patchTriggerAliases: {
    aliasesOverride: true,
    aliases: [],
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef" | "aliases"> = {
  projectRef: {
    id: "project",
  },
  aliases: [],
};

const repoForm: FormState = {
  patchAliases: {
    aliasesOverride: true,
    aliases: [],
  },
  patchTriggerAliases: {
    aliasesOverride: true,
    aliases: [],
  },
};

const repoResult: Pick<RepoSettingsInput, "projectRef" | "aliases"> = {
  projectRef: {
    id: "repo",
  },
  aliases: [],
};
