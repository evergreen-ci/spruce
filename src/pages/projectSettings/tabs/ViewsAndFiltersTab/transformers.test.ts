import { ProjectSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { FormState, CaseSensitivity, MatchType } from "./types";

const { projectBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL and omits empty strings", () => {
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
  });
});

const projectForm: FormState = {
  parsleyFilters: [
    {
      expression: "filter_1",
      displayTitle: "filter_1",
      caseSensitivity: CaseSensitivity.Sensitive,
      matchType: MatchType.Exact,
    },
    {
      expression: "filter_2",
      displayTitle: "filter_2",
      caseSensitivity: CaseSensitivity.Insensitive,
      matchType: MatchType.Inverse,
    },
  ],
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
  },
};
