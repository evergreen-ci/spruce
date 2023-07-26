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
      isAdminOnly: adminOnlyVars.includes(varName),
      isDisabled: privateVars.includes(varName),
      isPrivate: privateVars.includes(varName),
      varName,
      varValue: varValue || "{REDACTED}",
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
      adminOnlyVarsList: [],
      privateVarsList: [],
      vars: {},
    }
  );
  return {
    projectRef: { id },
    vars,
  };
}) satisfies FormToGqlFunction<Tab>;
