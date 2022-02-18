import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias, ProjectVariant } from "../utils";
import { FormState } from "./types";

const { sortAliases, transformAliases } = alias;

export const gqlToForm: GqlToFormFunction<FormState> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  options: { projectVariant: ProjectVariant }
): ReturnType<GqlToFormFunction> => {
  if (!data) return null;

  const { aliases } = data;
  const { projectVariant } = options;

  const { patchAliases } = sortAliases(aliases);

  return {
    patchAliases: {
      aliasesOverride:
        projectVariant !== ProjectVariant.AttachedProject ||
        !!patchAliases.length,
      aliases: patchAliases.map((a) => ({
        ...a,
        initialAlias: a.alias,
      })),
    },
  };
};

export const formToGql: FormToGqlFunction = (
  { patchAliases }: FormState,
  id
) => {
  const aliases = transformAliases(
    patchAliases.aliases,
    patchAliases.aliasesOverride
  );

  return {
    projectRef: { id },
    aliases,
  };
};
