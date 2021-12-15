import {
  ProjectSettingsFragment,
  ProjectSettingsInput,
} from "gql/generated/types";
import { FormState } from "./types";

const gqlInput: Pick<ProjectSettingsFragment, "vars"> = {
  vars: {
    vars: { test_name: "test_value" },
    privateVars: ["test_name"],
  },
};

const gqlResult: Partial<ProjectSettingsInput> = {
  projectRef: {
    id: "123",
  },
  vars: {
    vars: { test_name: "test_value" },
    privateVarsList: ["test_name"],
  },
};

const formData: FormState = {
  vars: [
    {
      varName: "test_name",
      varValue: "test_value",
      isPrivate: true,
    },
  ],
};

const data = {
  gql: {
    input: gqlInput,
    result: gqlResult,
  },
  form: formData,
};

export { data };
