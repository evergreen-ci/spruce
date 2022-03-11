import {
  ProjectInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, ProjectType } from "../utils";
import { FormState } from "./types";

const { AliasNames, sortAliases, transformAliases } = aliasUtils;

export const mergeProjectRepo = (
  projectData: FormState,
  repoData: FormState
): FormState => {
  // Merge project and repo objects so that repo config can be displayed on project pages
  const {
    github: { prTesting, githubChecks, users, teams, gitTags },
    commitQueue: { patchDefinitions },
  } = repoData;
  const mergedObject: FormState = projectData;
  mergedObject.github.prTesting.repoData = prTesting;
  mergedObject.github.githubChecks.repoData = githubChecks;
  mergedObject.github.users.repoData = users;
  mergedObject.github.teams.repoData = teams;
  mergedObject.github.gitTags.repoData = gitTags;
  mergedObject.commitQueue.patchDefinitions.repoData = patchDefinitions;
  return mergedObject;
};

export const gqlToForm: GqlToFormFunction<FormState> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  options: { projectType: ProjectType }
): ReturnType<GqlToFormFunction> => {
  if (!data) return null;

  const { projectRef, aliases } = data;
  const { projectType } = options;

  const {
    commitQueueAliases,
    githubPrAliases,
    githubCheckAliases,
    gitTagAliases,
  } = sortAliases(aliases);

  const override = (field: Array<any>) =>
    projectType !== ProjectType.AttachedProject || !!field?.length;

  return {
    github: {
      prTestingEnabled: projectRef.prTestingEnabled,
      prTesting: {
        githubPrAliasesOverride: override(githubPrAliases),
        githubPrAliases,
      },
      githubChecksEnabled: projectRef.githubChecksEnabled,
      githubChecks: {
        githubCheckAliasesOverride: override(githubCheckAliases),
        githubCheckAliases,
      },
      gitTagVersionsEnabled: projectRef.gitTagVersionsEnabled,
      users: {
        gitTagAuthorizedUsersOverride: override(
          projectRef.gitTagAuthorizedUsers
        ),
        gitTagAuthorizedUsers: projectRef.gitTagAuthorizedUsers,
      },
      teams: {
        gitTagAuthorizedTeamsOverride: override(
          projectRef.gitTagAuthorizedTeams
        ),
        gitTagAuthorizedTeams: projectRef.gitTagAuthorizedTeams,
      },
      gitTags: {
        gitTagAliasesOverride: override(gitTagAliases),
        gitTagAliases,
      },
    },
    commitQueue: {
      enabled: projectRef.commitQueue.enabled,
      requireSigned: projectRef.commitQueue.requireSigned,
      message: projectRef.commitQueue.message,
      mergeMethod: projectRef.commitQueue.mergeMethod,
      patchDefinitions: {
        commitQueueAliasesOverride: override(commitQueueAliases),
        commitQueueAliases,
      },
    },
  };
};

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
      gitTags,
    },
    commitQueue: {
      enabled,
      requireSigned,
      message,
      mergeMethod,
      patchDefinitions,
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
    commitQueue: {
      enabled,
      requireSigned,
      message,
      mergeMethod,
    },
  };

  const githubPrAliases = transformAliases(
    prTesting.githubPrAliases,
    prTesting.githubPrAliasesOverride,
    AliasNames.GithubPr
  );

  const githubCheckAliases = transformAliases(
    githubChecks.githubCheckAliases,
    githubChecks.githubCheckAliasesOverride,
    AliasNames.GithubCheck
  );

  const gitTagAliases = transformAliases(
    gitTags.gitTagAliases,
    gitTags.gitTagAliasesOverride,
    AliasNames.GitTag
  );

  const commitQueueAliases = transformAliases(
    patchDefinitions.commitQueueAliases,
    patchDefinitions.commitQueueAliasesOverride,
    AliasNames.CommitQueue
  );

  const aliases = [
    ...githubPrAliases,
    ...githubCheckAliases,
    ...gitTagAliases,
    ...commitQueueAliases,
  ];

  return {
    projectRef,
    aliases,
  };
};
