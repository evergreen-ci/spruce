import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

type Tab = ProjectSettingsTabRoutes.ViewsAndFilters;

export const gqlToForm: GqlToFormFunction<Tab> = (
  data: ProjectSettingsQuery["projectSettings"]
) => {
  if (!data) return null;

  const {
    projectRef: { parsleyFilters },
  } = data;

  return {
    parsleyFilters:
      parsleyFilters?.map(({ expression, caseSensitive, exactMatch }) => ({
        displayTitle: expression,
        expression,
        caseSensitive,
        exactMatch,
      })) ?? [],
  };
};

export const formToGql: FormToGqlFunction<Tab> = (
  { parsleyFilters }: FormState,
  id: string
) => ({
  projectRef: {
    id,
    parsleyFilters: parsleyFilters.map(
      ({ expression, caseSensitive, exactMatch }) => ({
        expression,
        caseSensitive,
        exactMatch,
      })
    ),
  },
});
