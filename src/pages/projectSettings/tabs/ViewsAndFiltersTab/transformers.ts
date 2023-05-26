import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

type Tab = ProjectSettingsTabRoutes.ViewsAndFilters;

export const gqlToForm: GqlToFormFunction<Tab> = (
  data: ProjectSettingsQuery["projectSettings"]
) => {
  if (!data) return null;

  return {};
};

export const formToGql: FormToGqlFunction<Tab> = (
  _formState: FormState,
  id: string
) => ({
  projectRef: {
    id,
  },
});
