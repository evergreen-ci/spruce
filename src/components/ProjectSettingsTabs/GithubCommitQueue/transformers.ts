import { ProjectAliasInput, ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { AliasType, FormState } from "./types";

enum AliasTypes {
  GithubPr = "__github",
  GithubCheck = "__github_checks",
  GitTag = "__git_tag",
}

export const gqlToForm: GqlToFormFunction = (data): FormState => {
  if (!data) return null;

  const { projectRef, aliases } = data;
  // @ts-ignore
  const { useRepoSettings = false } = projectRef;

  const { githubPrAliases, githubCheckAliases } = aliases.reduce(
    (o, a) => {
      if (a.alias === AliasTypes.GithubPr) {
        o.githubPrAliases.push(a);
      } else if (a.alias === AliasTypes.GithubCheck) {
        o.githubCheckAliases.push(a);
      } else if (a.alias === AliasTypes.GitTag) {
        o.gitTagAliases.push(a);
      }
      return o;
    },
    {
      githubPrAliases: [],
      githubCheckAliases: [],
      gitTagAliases: [],
    }
  );

  return {
    github: {
      prTestingEnabled: projectRef.prTestingEnabled,
      prTesting: {
        githubPrAliasesOverride: !useRepoSettings || !!githubPrAliases.length,
        githubPrAliases,
      },
      githubChecksEnabled: projectRef.githubChecksEnabled,
      githubChecks: {
        githubCheckAliasesOverride:
          !useRepoSettings || !!githubCheckAliases.length,
        githubCheckAliases,
      },
      gitTagVersionsEnabled: projectRef.gitTagVersionsEnabled,
      users: {
        gitTagAuthorizedUsersOverride:
          !useRepoSettings || !!projectRef.gitTagAuthorizedUsers?.length,
        gitTagAuthorizedUsers: projectRef.gitTagAuthorizedUsers,
      },
      teams: {
        gitTagAuthorizedTeamsOverride:
          !useRepoSettings || !!projectRef.gitTagAuthorizedTeams?.length,
        gitTagAuthorizedTeams: projectRef.gitTagAuthorizedTeams,
      },
    },
  };
};

const transformAliases = (
  aliases: AliasType[],
  aliasName: string,
  override: boolean
): ProjectAliasInput[] =>
  override
    ? aliases.map(({ id: aliasId, variant, variantTags, task, taskTags }) => ({
        id: aliasId || "",
        alias: aliasName,
        variant: variant || "",
        variantTags: variantTags?.filter((tag) => tag) ?? [],
        task: task || "",
        taskTags: taskTags?.filter((tag) => tag) ?? [],
        gitTag: "",
        remotePath: "",
      }))
    : [];

export const formToGql: FormToGqlFunction = (
  {
    github: {
      prTestingEnabled,
      prTesting,
      githubChecksEnabled,
      githubChecks,
      gitTagVersionsEnabled,
      users: { gitTagAuthorizedUsers, gitTagAuthorizedUsersOverride },
      teams: { gitTagAuthorizedTeams, gitTagAuthorizedTeamsOverride },
    },
  }: FormState,
  id
) => {
  const projectRef: ProjectInput = {
    id,
    prTestingEnabled,
    githubChecksEnabled,
    gitTagVersionsEnabled,
    gitTagAuthorizedUsers:
      (gitTagAuthorizedUsersOverride &&
        gitTagAuthorizedUsers?.filter((user) => user)) ||
      [],
    gitTagAuthorizedTeams:
      (gitTagAuthorizedTeamsOverride &&
        gitTagAuthorizedTeams?.filter((team) => team)) ||
      [],
  };

  const githubPrAliases = transformAliases(
    prTesting.githubPrAliases,
    AliasTypes.GithubPr,
    prTesting.githubPrAliasesOverride
  );

  const githubCheckAliases = transformAliases(
    githubChecks.githubCheckAliases,
    AliasTypes.GithubCheck,
    githubChecks.githubCheckAliasesOverride
  );

  const aliases = [...githubPrAliases, ...githubCheckAliases];

  return {
    projectRef,
    aliases,
  };
};
