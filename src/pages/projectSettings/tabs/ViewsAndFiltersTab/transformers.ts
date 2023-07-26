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
      parsleyFilters?.map(({ caseSensitive, exactMatch, expression }) => ({
        caseSensitive,
        displayTitle: expression,
        exactMatch,
        expression,
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
      ({ caseSensitive, exactMatch, expression }) => ({
        caseSensitive,
        exactMatch,
        expression,
      })
    ),
    projectHealthView: view.projectHealthView,
  },
})) satisfies FormToGqlFunction<Tab>;
