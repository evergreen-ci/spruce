import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { alias as aliasUtils, ProjectType } from "../utils";
import { GCQFormState } from "./types";

const { AliasNames, sortAliases, transformAliases } = aliasUtils;

type Tab = ProjectSettingsTabRoutes.GithubCommitQueue;

export const mergeProjectRepo = (
  projectData: GCQFormState,
  repoData: GCQFormState
): GCQFormState => {
  // Merge project and repo objects so that repo config can be displayed on project pages
  const {
    commitQueue: { patchDefinitions },
    github: { gitTags, githubChecks, prTesting, teams, users },
  } = repoData;
  const mergedObject: GCQFormState = projectData;
  mergedObject.github.prTesting.repoData = prTesting;
  mergedObject.github.githubChecks.repoData = githubChecks;
  mergedObject.github.users.repoData = users;
  mergedObject.github.teams.repoData = teams;
  mergedObject.github.gitTags.repoData = gitTags;
  mergedObject.commitQueue.patchDefinitions.repoData = patchDefinitions;
  return mergedObject;
};

export const gqlToForm = ((data, options) => {
  if (!data) return null;

  const { aliases, projectRef } = data;
  const { projectType } = options;

  const {
    commitQueue,
    gitTagAuthorizedTeams,
    gitTagAuthorizedUsers,
    gitTagVersionsEnabled,
    githubChecksEnabled,
    manualPrTestingEnabled,
    prTestingEnabled,
  } = projectRef;

  const {
    commitQueueAliases,
    gitTagAliases,
    githubCheckAliases,
    githubPrAliases,
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
    commitQueue: {
      enabled: commitQueue.enabled,
      mergeMethod: commitQueue.mergeMethod,
      mergeQueue: commitQueue.mergeQueue,
      message: commitQueue.message,
      patchDefinitions: {
        commitQueueAliases,
        commitQueueAliasesOverride: override(commitQueueAliases),
      },
    },
    github: {
      gitTagVersionsEnabled,
      gitTags: {
        gitTagAliases,
        gitTagAliasesOverride: override(gitTagAliases),
      },
      githubChecks: {
        githubCheckAliases,
        githubCheckAliasesOverride: override(githubCheckAliases),
      },
      githubChecksEnabled,
      githubTriggerAliases,
      manualPrTestingEnabled,
      prTesting: {
        githubPrAliases,
        githubPrAliasesOverride: override(githubPrAliases),
      },
      prTestingEnabled,
      teams: {
        gitTagAuthorizedTeams: gitTagAuthorizedTeams ?? [],
        gitTagAuthorizedTeamsOverride:
          projectType !== ProjectType.AttachedProject ||
          !!gitTagAuthorizedTeams,
      },
      users: {
        gitTagAuthorizedUsers: gitTagAuthorizedUsers ?? [],
        gitTagAuthorizedUsersOverride:
          projectType !== ProjectType.AttachedProject ||
          !!gitTagAuthorizedUsers,
      },
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  {
    commitQueue: {
      enabled,
      mergeMethod,
      mergeQueue,
      message,
      patchDefinitions,
    },
    github: {
      gitTagVersionsEnabled,
      gitTags,
      githubChecks,
      githubChecksEnabled,
      manualPrTestingEnabled,
      prTesting,
      prTestingEnabled,
      teams: { gitTagAuthorizedTeams, gitTagAuthorizedTeamsOverride },
      users: { gitTagAuthorizedUsers, gitTagAuthorizedUsersOverride },
    },
  },
  id
) => {
  const projectRef: ProjectInput = {
    commitQueue: {
      enabled,
      mergeMethod,
      mergeQueue,
      message,
    },
    gitTagAuthorizedTeams: gitTagAuthorizedTeamsOverride
      ? gitTagAuthorizedTeams
      : null,
    gitTagAuthorizedUsers: gitTagAuthorizedUsersOverride
      ? gitTagAuthorizedUsers
      : null,
    gitTagVersionsEnabled,
    githubChecksEnabled,
    id,
    manualPrTestingEnabled,
    prTestingEnabled,
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
    aliases,
    projectRef,
  };
}) satisfies FormToGqlFunction<Tab>;
