import { DistroSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = DistroSettingsTabRoutes.Project;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { cloneMethod, expansions, validProjects } = data;

  return {
    cloneMethod,
    expansions,
    validProjects,
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { cloneMethod, expansions, validProjects },
  distro,
) => ({
  ...distro,
  cloneMethod,
  expansions,
  validProjects,
})) satisfies FormToGqlFunction<Tab>;
