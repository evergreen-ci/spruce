import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, ProjectType } from "../utils";
import { FormState, TaskSpecifier } from "./types";

const { sortAliases, transformAliases } = aliasUtils;

type Tab = ProjectSettingsTabRoutes.PatchAliases;

export const gqlToForm: GqlToFormFunction<Tab> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  options: { projectType: ProjectType }
) => {
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
                ? TaskSpecifier.PatchAlias
                : TaskSpecifier.VariantTask,
            })) ?? [],
          status: p.status ?? "",
          parentAsModule: p.parentAsModule ?? "",
          isGithubTriggerAlias: githubTriggerAliases?.includes(p.alias),
          displayTitle: p.alias,
        })) ?? [],
    },
  };
};

export const formToGql: FormToGqlFunction<Tab> = (
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
          status: a.status,
          parentAsModule: a.parentAsModule,
        };
      })
    : null;

  return {
    projectRef: { id, patchTriggerAliases, githubTriggerAliases },
    aliases,
  };
};
