import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, ProjectType } from "../utils";
import { FormState, TaskSpecifiers } from "./types";

const { sortAliases, transformAliases } = aliasUtils;

export const gqlToForm: GqlToFormFunction<FormState> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  options: { projectType: ProjectType }
): ReturnType<GqlToFormFunction> => {
  if (!data) return null;

  const {
    projectRef: { patchTriggerAliases, githubTriggerAliases },
    aliases,
  } = data;
  const { projectType } = options;
  const isAttachedProject = projectType === ProjectType.AttachedProject;

  const { patchAliases } = sortAliases(aliases);

  return {
    patchAliases: {
      aliasesOverride: !isAttachedProject || !!patchAliases.length,
      aliases: patchAliases.map((a) => ({
        ...a,
        displayTitle: a.alias,
      })),
    },
    patchTriggerAliases: {
      aliasesOverride: !isAttachedProject || !!patchTriggerAliases,
      aliases:
        patchTriggerAliases?.map((p) => ({
          ...p,
          taskSpecifiers:
            p.taskSpecifiers?.map((t) => ({
              ...t,
              specifier: t.patchAlias
                ? TaskSpecifiers.PatchAlias
                : TaskSpecifiers.VariantTask,
            })) ?? [],
          status: p.status,
          parentAsModule: p.parentAsModule,
          isGithubTriggerAlias: githubTriggerAliases?.includes(p.alias),
          displayTitle: p.alias,
        })) ?? [],
    },
  };
};

export const formToGql: FormToGqlFunction = (
  { patchAliases, patchTriggerAliases: ptaData }: FormState,
  id
) => {
  const aliases = transformAliases(
    patchAliases.aliases,
    patchAliases.aliasesOverride
  );

  const githubTriggerAliases = [];
  const patchTriggerAliases = ptaData.aliasesOverride
    ? ptaData.aliases.map((a) => {
        if (a.isGithubTriggerAlias) {
          githubTriggerAliases.push(a.alias);
        }
        return {
          alias: a.alias,
          childProjectIdentifier: a.childProjectIdentifier,
          taskSpecifiers:
            a.taskSpecifiers?.map(
              ({ patchAlias, specifier, taskRegex, variantRegex }) =>
                specifier === TaskSpecifiers.PatchAlias
                  ? {
                      patchAlias,
                      taskRegex: "",
                      variantRegex: "",
                    }
                  : {
                      patchAlias: "",
                      taskRegex,
                      variantRegex,
                    }
            ) ?? [],
          status: a.status ?? "",
          parentAsModule: a.parentAsModule ?? "",
        };
      })
    : null;

  return {
    projectRef: { id, patchTriggerAliases, githubTriggerAliases },
    aliases,
  };
};
