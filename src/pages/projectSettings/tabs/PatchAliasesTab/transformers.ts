import { ProjectSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, ProjectType } from "../utils";
import { TaskSpecifier } from "./types";

const { sortAliases, transformAliases } = aliasUtils;

type Tab = ProjectSettingsTabRoutes.PatchAliases;

export const gqlToForm: GqlToFormFunction<Tab> = ((data, options) => {
  if (!data) return null;

  const {
    aliases,
    projectRef: { githubTriggerAliases, patchTriggerAliases },
  } = data;
  const { projectType } = options;
  const isAttachedProject = projectType === ProjectType.AttachedProject;

  const { patchAliases } = sortAliases(aliases);

  return {
    patchAliases: {
      aliases: patchAliases.map((a) => ({
        ...a,
        displayTitle: a.alias,
      })),
      aliasesOverride: !isAttachedProject || !!patchAliases.length,
    },
    patchTriggerAliases: {
      aliases:
        patchTriggerAliases?.map((p) => ({
          ...p,
          displayTitle: p.alias,
          isGithubTriggerAlias: githubTriggerAliases?.includes(p.alias),
          parentAsModule: p.parentAsModule ?? "",
          status: p.status ?? "",
          taskSpecifiers:
            p.taskSpecifiers?.map((t) => ({
              ...t,
              specifier: t.patchAlias
                ? TaskSpecifier.PatchAlias
                : TaskSpecifier.VariantTask,
            })) ?? [],
        })) ?? [],
      aliasesOverride: !isAttachedProject || !!patchTriggerAliases,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { patchAliases, patchTriggerAliases: ptaData },
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
          parentAsModule: a.parentAsModule,
          status: a.status,
          taskSpecifiers:
            a.taskSpecifiers?.map(
              ({ patchAlias, specifier, taskRegex, variantRegex }) =>
                specifier === TaskSpecifier.PatchAlias
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
        };
      })
    : null;

  return {
    aliases,
    projectRef: { githubTriggerAliases, id, patchTriggerAliases },
  };
}) satisfies FormToGqlFunction<Tab>;
