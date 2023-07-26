import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { alias, ProjectType } from "../utils";
import { formToGql, gqlToForm } from "./transformers";
import { PatchAliasesFormState, TaskSpecifier } from "./types";

const { VariantTaskSpecifier } = alias;
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

const projectForm: PatchAliasesFormState = {
  patchAliases: {
    aliases: [],
    aliasesOverride: false,
  },
  patchTriggerAliases: {
    aliases: [],
    aliasesOverride: false,
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef" | "aliases"> = {
  aliases: [],
  projectRef: {
    githubTriggerAliases: [],
    id: "project",
    patchTriggerAliases: null,
  },
};

const repoForm: PatchAliasesFormState = {
  patchAliases: {
    aliases: [
      {
        alias: "my alias name",
        description: "my description",
        displayTitle: "my alias name",
        gitTag: "",
        id: "4",
        remotePath: "",
        tasks: {
          specifier: VariantTaskSpecifier.Tags,
          task: "",
          taskTags: ["hi"],
        },
        variants: {
          specifier: VariantTaskSpecifier.Tags,
          variant: "",
          variantTags: ["okay"],
        },
      },
    ],
    aliasesOverride: true,
  },
  patchTriggerAliases: {
    aliases: [
      {
        alias: "alias1",
        childProjectIdentifier: "spruce",
        displayTitle: "alias1",
        isGithubTriggerAlias: true,
        parentAsModule: "",
        status: "succeeded",
        taskSpecifiers: [
          {
            patchAlias: "alias2",
            specifier: TaskSpecifier.PatchAlias,
            taskRegex: "",
            variantRegex: "",
          },
          {
            patchAlias: "",
            specifier: TaskSpecifier.VariantTask,
            taskRegex: ".*",
            variantRegex: ".*",
          },
        ],
      },
    ],
    aliasesOverride: true,
  },
};

const repoResult: Pick<RepoSettingsInput, "projectRef" | "aliases"> = {
  aliases: [
    {
      alias: "my alias name",
      description: "my description",
      gitTag: "",
      id: "4",
      remotePath: "",
      task: "",
      taskTags: ["hi"],
      variant: "",
      variantTags: ["okay"],
    },
  ],
  projectRef: {
    githubTriggerAliases: ["alias1"],
    id: "repo",
    patchTriggerAliases: [
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
  },
};
