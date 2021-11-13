import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectGeneralSettingsFragment,
  RepoGeneralSettingsFragment,
} from "gql/generated/types";
import { GeneralFormState } from "./GeneralTab/formState";

export type FormStateMap = {
  [ProjectSettingsTabRoutes.General]: GeneralFormState;
};

export type GeneralTabProps = {
  projectData?: ProjectGeneralSettingsFragment;
  projectId?: string;
  repoData?: RepoGeneralSettingsFragment;
  useRepoSettings: boolean;
};
