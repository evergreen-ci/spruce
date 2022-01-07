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
      varValue: varValue || "{REDACTED}",
      isPrivate: privateVars.includes(varName),
      isDisabled: privateVars.includes(varName),
    })),
  };
};

export const formToGql: FormToGqlFunction = (
  { vars: varsData }: FormState,
  id
) => {
  const vars = varsData.reduce(
    (acc, { varName, varValue, isPrivate }) => {
      if (!varName || !varValue) return acc;
      if (isPrivate) {
        acc.privateVarsList.push(varName);
      }
      acc.vars[varName] = varValue;
      return acc;
    },
    {
      vars: {},
      privateVarsList: [],
    }
  );
  return {
    projectRef: { id },
    vars,
  };
};
