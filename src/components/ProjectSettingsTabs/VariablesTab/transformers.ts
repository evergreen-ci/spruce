import { ProjectVarsInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

export const gqlToForm: GqlToFormFunction = (data): FormState => {
  if (!data) return null;

  const {
    vars: { privateVars, vars },
  } = data;

  return {
    vars: Object.entries(vars).map(([varName, varValue]) => ({
      varName,
      varValue,
      isPrivate: privateVars.includes(varName),
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

  varsData.forEach(({ varName, varValue, isPrivate }) => {
    if (varName === "") return;

    if (isPrivate) {
      vars.privateVarsList.push(varName);
    }
    vars.vars[varName] = varValue;
  });

  return {
    projectRef: { id },
    vars,
  };
};
