import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias } from "../utils";
import { FormState } from "./types";

const { sortAliases, transformAliases } = alias;

export const gqlToForm: GqlToFormFunction = (data): FormState => {
  if (!data) return null;

  const { projectRef, aliases } = data;

  const isRepo = Object.prototype.hasOwnProperty.call(data, "useRepoSettings");

  // @ts-ignore
  const useRepoSettings = isRepo ? false : projectRef.useRepoSettings;

  const { patchAliases } = sortAliases(aliases);

  return {
    patchAliases: {
      aliasesOverride: !useRepoSettings || !!patchAliases.length,
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
  const aliases = transformAliases(patchAliases.aliases);

  return {
    projectRef: { id },
    aliases,
  };
};
