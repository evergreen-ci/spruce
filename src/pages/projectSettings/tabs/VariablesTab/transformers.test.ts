import { ProjectSettingsInput } from "gql/generated/types";
import { Unpacked } from "types/utils";
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
          vars: [...form.vars, {} as Unpacked<FormState["vars"]>],
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
      varValue: "{REDACTED}",
      isPrivate: true,
      isAdminOnly: true,
      isDisabled: true,
    },
    {
      varName: "test_two",
      varValue: "val",
      isPrivate: false,
      isAdminOnly: false,
      isDisabled: false,
    },
  ],
};

const result: Pick<ProjectSettingsInput, "projectRef" | "vars"> = {
  projectRef: {
    id: "project",
  },
  vars: {
    vars: { test_name: "", test_two: "val" },
    privateVarsList: ["test_name"],
    adminOnlyVarsList: ["test_name"],
  },
};
