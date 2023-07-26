import { ProjectHealthView, ProjectSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { ViewsFormState } from "./types";

const { projectBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
  });
});

const projectForm: ViewsFormState = {
  parsleyFilters: [
    {
      caseSensitive: true,
      displayTitle: "filter_1",
      exactMatch: true,
      expression: "filter_1",
    },
    {
      caseSensitive: false,
      displayTitle: "filter_2",
      exactMatch: false,
      expression: "filter_2",
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
        caseSensitive: true,
        exactMatch: true,
        expression: "filter_1",
      },
      {
        caseSensitive: false,
        exactMatch: false,
        expression: "filter_2",
      },
    ],
    projectHealthView: ProjectHealthView.Failed,
  },
};
