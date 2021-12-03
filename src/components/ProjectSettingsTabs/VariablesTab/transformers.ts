import { ProjectVarsInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

export const gqlToForm: GqlToFormFunction = (data): FormState => {
  if (!data) return null;

  const {
    vars: { privateVars, vars },
  } = data;

  return {
    vars: Object.entries(vars).map(([name, value]) => ({
      name,
      value,
      private: privateVars.includes(name),
    })),
  };
};

export const formToGql: FormToGqlFunction = (
  { vars: varsData }: FormState,
  id
) => {
  const vars: ProjectVarsInput = {
    vars: {} as ProjectVarsInput["vars"],
    privateVarsList: [] as ProjectVarsInput["privateVarsList"],
  };

  varsData.forEach(({ name, value, private: isPrivate }) => {
    if (name === "" || value === "") return;

    if (isPrivate) {
      vars.privateVarsList.push(name);
    }
    vars.vars[name] = value;
  });

  return {
    projectRef: { id },
    vars,
  };
};
