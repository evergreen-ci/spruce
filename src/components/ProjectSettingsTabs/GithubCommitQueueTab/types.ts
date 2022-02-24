import { AliasType, ProjectType } from "../utils";

export interface FormState {
  github: {
    prTestingEnabled: boolean | null;
    prTesting: {
      githubPrAliasesOverride: boolean;
      githubPrAliases: Array<AliasType>;
      repoData?: {
        githubPrAliasesOverride: boolean;
        githubPrAliases: Array<AliasType>;
      };
    };
    githubChecksEnabled: boolean;
    githubChecks: {
      githubCheckAliasesOverride: boolean;
      githubCheckAliases: Array<AliasType>;
      repoData?: {
        githubCheckAliasesOverride: boolean;
        githubCheckAliases: Array<AliasType>;
      };
    };
    gitTagVersionsEnabled: boolean | null;
    users: {
      gitTagAuthorizedUsersOverride: boolean;
      gitTagAuthorizedUsers: Array<string> | null;
      repoData?: {
        gitTagAuthorizedUsersOverride: boolean;
        gitTagAuthorizedUsers: Array<string> | null;
      };
    };
    teams: {
      gitTagAuthorizedTeamsOverride: boolean;
      gitTagAuthorizedTeams: Array<string> | null;
      repoData?: {
        gitTagAuthorizedTeamsOverride: boolean;
        gitTagAuthorizedTeams: Array<string> | null;
      };
    };
  };
  commitQueue: {
    enabled: boolean | null;
    requireSigned: boolean | null;
    mergeMethod: string;
    message: string;
    patchDefinitions: {
      commitQueueAliasesOverride: boolean;
      commitQueueAliases: Array<AliasType>;
      repoData?: {
        commitQueueAliasesOverride: boolean;
        commitQueueAliases: Array<AliasType>;
      };
    };
  };
}

export type TabProps = {
  gitHubWebhooksEnabled: boolean;
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
