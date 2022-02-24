import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

export const gqlToForm: GqlToFormFunction = (data): FormState => {
  if (!data) return null;

  const {
    vars: { adminOnlyVars, privateVars, vars },
  } = data;
  console.log("isDisabled: ", adminOnlyVars);

  return {
    vars: Object.entries(vars).map(([varName, varValue]) => ({
      varName,
      varValue: varValue || "{REDACTED}",
      isPrivate: privateVars.includes(varName),
      isAdminOnly: adminOnlyVars.includes(varName),
      isDisabled: privateVars.includes(varName),
    })),
  };
};

export const formToGql: FormToGqlFunction = (
  { vars: varsData }: FormState,
  id
) => {
  const vars = varsData.reduce(
    (acc, { varName, varValue, isPrivate, isAdminOnly }) => {
      if (!varName || !varValue) return acc;
      if (isPrivate) {
        acc.privateVarsList.push(varName);
      }
      if (isAdminOnly) {
        acc.adminOnlyVarsList.push(varName);
      }
      acc.vars[varName] = varValue;
      return acc;
    },
    {
      vars: {},
      privateVarsList: [],
      adminOnlyVarsList: [],
    }
  );
  return {
    projectRef: { id },
    vars,
  };
};
