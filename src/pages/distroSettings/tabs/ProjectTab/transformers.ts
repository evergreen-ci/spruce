import { DistroSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = DistroSettingsTabRoutes.Project;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { expansions, validProjects } = data;

  return {
    expansions,
    validProjects,
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ expansions, validProjects }, distro) => ({
  ...distro,
  expansions,
  validProjects,
})) satisfies FormToGqlFunction<Tab>;
