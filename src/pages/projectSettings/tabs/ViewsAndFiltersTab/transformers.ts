import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.ViewsAndFilters;

export const gqlToForm = ((data: ProjectSettingsQuery["projectSettings"]) => {
  if (!data) return null;

  const {
    projectRef: { parsleyFilters, projectHealthView },
  } = data;

  return {
    parsleyFilters:
      parsleyFilters?.map(({ expression, caseSensitive, exactMatch }) => ({
        displayTitle: expression,
        expression,
        caseSensitive,
        exactMatch,
      })) ?? [],
    view: {
      projectHealthView,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ parsleyFilters, view }, id) => ({
  projectRef: {
    id,
    parsleyFilters: parsleyFilters.map(
      ({ expression, caseSensitive, exactMatch }) => ({
        expression,
        caseSensitive,
        exactMatch,
      })
    ),
    projectHealthView: view.projectHealthView,
  },
})) satisfies FormToGqlFunction<Tab>;
