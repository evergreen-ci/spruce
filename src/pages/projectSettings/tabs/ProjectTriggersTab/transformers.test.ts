import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { ProjectType } from "../utils";
import { formToGql, gqlToForm } from "./transformers";
import { ProjectTriggersFormState } from "./types";

const { projectBase, repoBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(
      gqlToForm(projectBase, { projectType: ProjectType.AttachedProject }),
    ).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL", () => {
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

const projectForm: ProjectTriggersFormState = {
  triggersOverride: true,
  triggers: [],
};

const projectResult: Pick<ProjectSettingsInput, "projectRef"> = {
  projectRef: {
    id: "project",
    triggers: [],
  },
};

const repoForm: ProjectTriggersFormState = {
  triggersOverride: true,
  triggers: [
    {
      alias: "my-alias",
      buildVariantRegex: ".*",
      configFile: ".evergreen.yml",
      dateCutoff: 1,
      displayTitle: "spruce: On task succeeded",
      level: "task",
      project: "spruce",
      status: "succeeded",
      taskRegex: ".*",
      unscheduleDownstreamVersions: true,
    },
  ],
};

const repoResult: Pick<RepoSettingsInput, "projectRef"> = {
  projectRef: {
    id: "repo",
    triggers: [
      {
        alias: "my-alias",
        buildVariantRegex: ".*",
        configFile: ".evergreen.yml",
        dateCutoff: 1,
        level: "task",
        project: "spruce",
        status: "succeeded",
        taskRegex: ".*",
        unscheduleDownstreamVersions: true,
      },
    ],
  },
};
