import {
  ProjectGeneralSettingsFragment,
  RepoGeneralSettingsFragment,
} from "gql/generated/types";

export type GeneralTabProps = {
  projectData?: ProjectGeneralSettingsFragment;
  projectId?: string;
  repoData?: RepoGeneralSettingsFragment;
  useRepoSettings: boolean;
};
