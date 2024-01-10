import {
  ProjectHealthView,
  ProjectSettingsInput,
  RepoSettingsInput,
} from "gql/generated/types";
import { data } from "../testData";
import { ProjectType } from "../utils";
import { formToGql, gqlToForm } from "./transformers";
import { ViewsFormState } from "./types";

const { projectBase, repoBase } = data;

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

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(
      gqlToForm(projectBase, { projectType: ProjectType.Project }),
    ).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
  });
});

const repoForm: ViewsFormState = {
  parsleyFilters: [
    {
      displayTitle: "repo-filter",
      expression: "repo-filter",
      caseSensitive: false,
      exactMatch: false,
    },
  ],
};

const repoResult: Pick<RepoSettingsInput, "projectRef"> = {
  projectRef: {
    id: "repo",
    parsleyFilters: [
      {
        expression: "repo-filter",
        caseSensitive: false,
        exactMatch: false,
      },
    ],
  },
};

const projectForm: ViewsFormState = {
  parsleyFilters: [
    {
      displayTitle: "filter_1",
      expression: "filter_1",
      caseSensitive: true,
      exactMatch: true,
    },
    {
      displayTitle: "filter_2",
      expression: "filter_2",
      caseSensitive: false,
      exactMatch: false,
    },
  ],
  view: {
    projectHealthView: ProjectHealthView.Failed,
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef"> = {
  projectRef: {
    id: "project",
    parsleyFilters: [
      {
        expression: "filter_1",
        caseSensitive: true,
        exactMatch: true,
      },
      {
        expression: "filter_2",
        caseSensitive: false,
        exactMatch: false,
      },
    ],
    projectHealthView: ProjectHealthView.Failed,
  },
};
