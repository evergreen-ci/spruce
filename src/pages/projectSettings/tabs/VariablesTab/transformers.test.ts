import { ProjectSettingsInput } from "gql/generated/types";
import { Unpacked } from "types/utils";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { VariablesFormState } from "./types";

const { projectBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL and omits empty fields", () => {
    expect(
      formToGql(
        {
          vars: [...form.vars, {} as Unpacked<VariablesFormState["vars"]>],
        },
        "project"
      )
    ).toStrictEqual(result);
  });
});

const form: VariablesFormState = {
  vars: [
    {
      isAdminOnly: true,
      isDisabled: true,
      isPrivate: true,
      varName: "test_name",
      varValue: "{REDACTED}",
    },
    {
      isAdminOnly: false,
      isDisabled: false,
      isPrivate: false,
      varName: "test_two",
      varValue: "val",
    },
  ],
};

const result: Pick<ProjectSettingsInput, "projectRef" | "vars"> = {
  projectRef: {
    id: "project",
  },
  vars: {
    adminOnlyVarsList: ["test_name"],
    privateVarsList: ["test_name"],
    vars: { test_name: "", test_two: "val" },
  },
};
