import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, ProjectType } from "../utils";
import { FormState } from "./types";

const { AliasNames, sortAliases, transformAliases } = aliasUtils;

type Tab = ProjectSettingsTabRoutes.GithubCommitQueue;

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

export const gqlToForm: GqlToFormFunction<Tab> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  options: { projectType: ProjectType }
) => {
  if (!data) return null;

  const { projectRef, aliases } = data;
  const { projectType } = options;

  const {
    prTestingEnabled,
    manualPrTestingEnabled,
    githubChecksEnabled,
    gitTagVersionsEnabled,
    gitTagAuthorizedUsers,
    gitTagAuthorizedTeams,
    commitQueue,
  } = projectRef;

  const {
    commitQueueAliases,
    githubPrAliases,
    githubCheckAliases,
    gitTagAliases,
  } = sortAliases(aliases);

  const override = (field: Array<any>) =>
    projectType !== ProjectType.AttachedProject || !!field?.length;

  const githubTriggerAliases =
    projectRef.githubTriggerAliases
      ?.map((aliasName) =>
        projectRef.patchTriggerAliases.find(({ alias }) => alias === aliasName)
      )
      ?.filter((a) => a) ?? [];

  return {
    github: {
      prTestingEnabled,
      manualPrTestingEnabled,
      prTesting: {
        githubPrAliasesOverride: override(githubPrAliases),
        githubPrAliases,
      },
      githubTriggerAliases,
      githubChecksEnabled,
      githubChecks: {
        githubCheckAliasesOverride: override(githubCheckAliases),
        githubCheckAliases,
      },
      gitTagVersionsEnabled,
      users: {
        gitTagAuthorizedUsersOverride:
          projectType !== ProjectType.AttachedProject ||
          !!gitTagAuthorizedUsers,
        gitTagAuthorizedUsers: gitTagAuthorizedUsers ?? [],
      },
      teams: {
        gitTagAuthorizedTeamsOverride:
          projectType !== ProjectType.AttachedProject ||
          !!gitTagAuthorizedTeams,
        gitTagAuthorizedTeams: gitTagAuthorizedTeams ?? [],
      },
      gitTags: {
        gitTagAliasesOverride: override(gitTagAliases),
        gitTagAliases,
      },
    },
    commitQueue: {
      enabled: commitQueue.enabled,
      requireSigned: commitQueue.requireSigned,
      message: commitQueue.message,
      mergeMethod: commitQueue.mergeMethod,
      patchDefinitions: {
        commitQueueAliasesOverride: override(commitQueueAliases),
        commitQueueAliases,
      },
    },
  };
};

export const formToGql: FormToGqlFunction<Tab> = (
  {
    github: {
      prTestingEnabled,
      manualPrTestingEnabled,
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
    manualPrTestingEnabled,
    githubChecksEnabled,
    gitTagVersionsEnabled,
    gitTagAuthorizedUsers: gitTagAuthorizedUsersOverride
      ? gitTagAuthorizedUsers
      : null,
    gitTagAuthorizedTeams: gitTagAuthorizedTeamsOverride
      ? gitTagAuthorizedTeams
      : null,
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
