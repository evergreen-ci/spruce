import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState, CaseSensitivity, MatchType } from "./types";

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
        caseSensitivity: caseSensitive
          ? CaseSensitivity.Sensitive
          : CaseSensitivity.Insensitive,
        matchType: exactMatch ? MatchType.Exact : MatchType.Inverse,
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
      ({ expression, caseSensitivity, matchType }) => ({
        expression,
        caseSensitive: caseSensitivity === CaseSensitivity.Sensitive,
        exactMatch: matchType === MatchType.Exact,
      })
    ),
  },
});
