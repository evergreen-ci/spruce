import { ProjectSettingsTabRoutes } from "constants/routes";
import { PatchStatus } from "types/patch";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, ProjectType } from "../utils";
import { TaskSpecifier } from "./types";

const { sortAliases, transformAliases } = aliasUtils;

type Tab = ProjectSettingsTabRoutes.PatchAliases;

// Ensure that the front end can ingest patch trigger alias status filters that use either "success" or "succeeded" and convert them to "success".
// TODO EVG-20032: Remove conversion.
const migrateSuccessStatus = (status: string) => {
  if (status === PatchStatus.LegacySucceeded) {
    return PatchStatus.Success;
  }
  return status ?? "";
};

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
          status: migrateSuccessStatus(p.status),
          parentAsModule: p.parentAsModule ?? "",
          isGithubTriggerAlias: githubTriggerAliases?.includes(p.alias),
          displayTitle: p.alias,
        })) ?? [],
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { patchAliases, patchTriggerAliases: ptaData },
  id,
) => {
  const aliases = transformAliases(
    patchAliases.aliases,
    patchAliases.aliasesOverride,
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
                    },
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
}) satisfies FormToGqlFunction<Tab>;
