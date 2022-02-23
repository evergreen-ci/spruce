import { ProjectSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { FormState } from "./types";

const { projectBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL and omits empty fields", () => {
    expect(
      formToGql(
        {
          vars: [...form.vars, {}],
        },
        "project"
      )
    ).toStrictEqual(result);
  });
});

const form: FormState = {
  vars: [
    {
      varName: "test_name",
      varValue: "test_value",
      isPrivate: true,
      isAdminOnly: false,
      isDisabled: true,
    },
  ],
};

const result: Pick<ProjectSettingsInput, "projectRef" | "vars"> = {
  projectRef: {
    id: "project",
  },
  vars: {
    vars: { test_name: "test_value" },
    privateVarsList: ["test_name"],
  },
};
