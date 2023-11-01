import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";

type Tab = ProjectSettingsTabRoutes.ViewsAndFilters;

export const gqlToForm = ((data, { projectType }) => {
  if (!data) return null;

  const { projectRef } = data;

  return {
    parsleyFilters:
      projectRef.parsleyFilters?.map(
        ({ caseSensitive, exactMatch, expression }) => ({
          displayTitle: expression,
          expression,
          caseSensitive,
          exactMatch,
        })
      ) ?? [],
    ...(projectType !== ProjectType.Repo &&
      "projectHealthView" in projectRef && {
        view: {
          projectHealthView: projectRef.projectHealthView,
        },
      }),
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((formState, id) => ({
  projectRef: {
    id,
    parsleyFilters: formState.parsleyFilters.map(
      ({ caseSensitive, exactMatch, expression }) => ({
        expression,
        caseSensitive,
        exactMatch,
      })
    ),
    ...("view" in formState && {
      projectHealthView: formState.view.projectHealthView,
    }),
  },
})) satisfies FormToGqlFunction<Tab>;
