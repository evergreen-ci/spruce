import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.ViewsAndFilters;

export const gqlToForm = ((data) => {
  if (!data) return null;

  return {};
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((_formState, id) => ({
  projectRef: {
    id,
  },
})) satisfies FormToGqlFunction<Tab>;
