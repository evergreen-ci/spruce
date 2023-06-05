import { ProjectHealthView, ProjectSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { FormState } from "./types";

const { projectBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
  });
});

const projectForm: FormState = {
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
    projectHealthView: ProjectHealthView.All,
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
    projectHealthView: ProjectHealthView.All,
  },
};
