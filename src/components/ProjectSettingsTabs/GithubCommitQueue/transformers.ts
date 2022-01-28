import { ProjectAliasInput, ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { AliasType, FormState } from "./types";

enum AliasTypes {
  GithubPr = "__github",
  GithubCheck = "__github_checks",
  GitTag = "__git_tag",
}

export const mergeProjectRepo = (
  projectData: FormState,
  repoData: FormState
): FormState => {
  // Merge project and repo objects so that repo config can be displayed on project pages
  const {
    github: { prTesting, githubChecks, users, teams },
  } = repoData;
  const mergedObject: FormState = projectData;
  mergedObject.github.prTesting.repoData = prTesting;
  mergedObject.github.githubChecks.repoData = githubChecks;
  mergedObject.github.users.repoData = users;
  mergedObject.github.teams.repoData = teams;
  return mergedObject;
};

export const gqlToForm: GqlToFormFunction = (data): FormState => {
  if (!data) return null;

  const { projectRef, aliases } = data;

  const isRepo = Object.prototype.hasOwnProperty.call(data, "useRepoSettings");

  // @ts-ignore
  const useRepoSettings = isRepo ? false : projectRef.useRepoSettings;

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
        githubPrAliasesOverride:
          !useRepoSettings ||
          (!!projectRef.prTestingEnabled && !!githubPrAliases.length),
        githubPrAliases,
      },
      githubChecksEnabled: projectRef.githubChecksEnabled,
      githubChecks: {
        githubCheckAliasesOverride:
          !useRepoSettings ||
          (!!projectRef.githubChecksEnabled && !!githubCheckAliases.length),
        githubCheckAliases,
      },
      gitTagVersionsEnabled: projectRef.gitTagVersionsEnabled,
      users: {
        gitTagAuthorizedUsersOverride:
          !useRepoSettings ||
          (!!projectRef.gitTagVersionsEnabled &&
            !!projectRef.gitTagAuthorizedUsers?.length),
        gitTagAuthorizedUsers: projectRef.gitTagAuthorizedUsers,
      },
      teams: {
        gitTagAuthorizedTeamsOverride:
          !useRepoSettings ||
          (!!projectRef.gitTagVersionsEnabled &&
            !!projectRef.gitTagAuthorizedTeams?.length),
        gitTagAuthorizedTeams: projectRef.gitTagAuthorizedTeams,
      },
    },
  };
};

const transformAliases = (
  aliases: AliasType[],
  aliasName: string
): ProjectAliasInput[] =>
  aliases.map(({ id: aliasId, variant, variantTags, task, taskTags }) => ({
    id: aliasId || "",
    alias: aliasName,
    variant: variant || "",
    variantTags: variantTags?.filter((tag) => tag) ?? [],
    task: task || "",
    taskTags: taskTags?.filter((tag) => tag) ?? [],
    gitTag: "",
    remotePath: "",
  }));

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
    AliasTypes.GithubPr
  );

  const githubCheckAliases = transformAliases(
    githubChecks.githubCheckAliases,
    AliasTypes.GithubCheck
  );

  const aliases = [...githubPrAliases, ...githubCheckAliases];

  return {
    projectRef,
    aliases,
  };
};
