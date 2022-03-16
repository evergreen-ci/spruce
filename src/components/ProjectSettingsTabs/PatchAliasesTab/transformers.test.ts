import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { alias, ProjectType } from "../utils";
import { formToGql, gqlToForm } from "./transformers";
import { FormState, TaskSpecifier } from "./types";

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

const projectForm: FormState = {
  patchAliases: {
    aliasesOverride: false,
    aliases: [],
  },
  patchTriggerAliases: {
    aliasesOverride: false,
    aliases: [],
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef" | "aliases"> = {
  projectRef: {
    id: "project",
    patchTriggerAliases: null,
    githubTriggerAliases: [],
  },
  aliases: [],
};

const repoForm: FormState = {
  patchAliases: {
    aliasesOverride: true,
    aliases: [
      {
        id: "4",
        alias: "my alias name",
        displayTitle: "my alias name",
        gitTag: "",
        remotePath: "",
        variants: {
          specifier: VariantTaskSpecifier.Tags,
          variant: "",
          variantTags: ["okay"],
        },
        tasks: {
          specifier: VariantTaskSpecifier.Tags,
          task: "",
          taskTags: ["hi"],
        },
      },
    ],
  },
  patchTriggerAliases: {
    aliasesOverride: true,
    aliases: [
      {
        alias: "alias1",
        childProjectIdentifier: "spruce",
        status: "succeeded",
        displayTitle: "alias1",
        parentAsModule: "",
        isGithubTriggerAlias: true,
        taskSpecifiers: [
          {
            specifier: TaskSpecifier.PatchAlias,
            patchAlias: "alias2",
            taskRegex: "",
            variantRegex: "",
          },
          {
            specifier: TaskSpecifier.VariantTask,
            patchAlias: "",
            taskRegex: ".*",
            variantRegex: ".*",
          },
        ],
      },
    ],
  },
};

const repoResult: Pick<RepoSettingsInput, "projectRef" | "aliases"> = {
  projectRef: {
    id: "repo",
    patchTriggerAliases: [
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
    githubTriggerAliases: ["alias1"],
  },
  aliases: [
    {
      id: "4",
      alias: "my alias name",
      gitTag: "",
      variant: "",
      task: "",
      remotePath: "",
      variantTags: ["okay"],
      taskTags: ["hi"],
    },
  ],
};
