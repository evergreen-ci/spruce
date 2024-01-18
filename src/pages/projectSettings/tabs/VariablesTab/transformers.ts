import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.Variables;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const {
    vars: { adminOnlyVars, privateVars, vars },
  } = data;

  return {
    vars: Object.entries(vars).map(([varName, varValue]) => ({
      varName,
      varValue: varValue || "{REDACTED}",
      isPrivate: privateVars.includes(varName),
      isAdminOnly: adminOnlyVars.includes(varName),
      isDisabled: privateVars.includes(varName),
    })),
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ vars: varsData }, id) => {
  const vars = varsData.reduce(
    (acc, { isAdminOnly, isDisabled, isPrivate, varName, varValue }) => {
      if (!varName || !varValue) return acc;

      let val = varValue;
      if (isPrivate) {
        acc.privateVarsList.push(varName);
        // Overwrite {REDACTED} for variables that have been previously saved as private variables
        if (isDisabled) val = "";
      }
      if (isAdminOnly) {
        acc.adminOnlyVarsList.push(varName);
      }
      acc.vars[varName] = val;
      return acc;
    },
    {
      vars: {},
      privateVarsList: [],
      adminOnlyVarsList: [],
    },
  );
  return {
    projectRef: { id },
    vars,
  };
}) satisfies FormToGqlFunction<Tab>;
