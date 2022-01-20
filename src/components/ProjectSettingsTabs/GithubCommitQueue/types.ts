import { FormDataProps } from "components/SpruceForm";

export type AliasType = {
  id: string;
  alias: string;
  gitTag: string;
  remotePath: string;
  variant: string;
  variantTags: string[];
  task: string;
  taskTags: string[];
};

export interface FormState extends FormDataProps {
  github: {
    prTestingEnabled: boolean | null;
    prTesting: {
      githubPrAliasesOverride: boolean;
      githubPrAliases: Array<AliasType> | null;
      repoData?: {
        githubPrAliasesOverride: boolean;
        githubPrAliases: Array<AliasType> | null;
      };
    };
    githubChecksEnabled: boolean;
    githubChecks: {
      githubCheckAliasesOverride: boolean;
      githubCheckAliases: Array<AliasType> | null;
      repoData?: {
        githubCheckAliasesOverride: boolean;
        githubCheckAliases: Array<AliasType> | null;
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
}

export type TabProps = {
  gitHubWebhooksEnabled: boolean;
  projectData?: FormState;
  repoData?: FormState;
  useRepoSettings: boolean;
};
