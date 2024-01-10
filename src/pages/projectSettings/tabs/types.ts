import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectSettingsInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { AccessFormState } from "./AccessTab/types";
import { ContainersFormState } from "./ContainersTab/types";
import { GeneralFormState } from "./GeneralTab/types";
import { GCQFormState } from "./GithubCommitQueueTab/types";
import { NotificationsFormState } from "./NotificationsTab/types";
import { PatchAliasesFormState } from "./PatchAliasesTab/types";
import { PeriodicBuildsFormState } from "./PeriodicBuildsTab/types";
import { PluginsFormState } from "./PluginsTab/types";
import { ProjectTriggersFormState } from "./ProjectTriggersTab/types";
import { ProjectType } from "./utils";
import { VariablesFormState } from "./VariablesTab/types";
import { ViewsFormState } from "./ViewsAndFiltersTab/types";
import { VWFormState } from "./VirtualWorkstationTab/types";

export type FormStateMap = {
  [T in WritableProjectSettingsType]: {
    [ProjectSettingsTabRoutes.Access]: AccessFormState;
    [ProjectSettingsTabRoutes.Containers]: ContainersFormState;
    [ProjectSettingsTabRoutes.General]: GeneralFormState;
    [ProjectSettingsTabRoutes.GithubCommitQueue]: GCQFormState;
    [ProjectSettingsTabRoutes.Notifications]: NotificationsFormState;
    [ProjectSettingsTabRoutes.PatchAliases]: PatchAliasesFormState;
    [ProjectSettingsTabRoutes.PeriodicBuilds]: PeriodicBuildsFormState;
    [ProjectSettingsTabRoutes.Plugins]: PluginsFormState;
    [ProjectSettingsTabRoutes.ProjectTriggers]: ProjectTriggersFormState;
    [ProjectSettingsTabRoutes.Variables]: VariablesFormState;
    [ProjectSettingsTabRoutes.ViewsAndFilters]: ViewsFormState;
    [ProjectSettingsTabRoutes.VirtualWorkstation]: VWFormState;
  }[T];
};

export type TabDataProps = {
  [T in WritableProjectSettingsType]: {
    projectData: FormStateMap[T];
    repoData: FormStateMap[T];
  };
};

export type GqlToFormFunction<T extends WritableProjectSettingsType> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  options?: { projectType?: ProjectType },
) => FormStateMap[T];

export type FormToGqlFunction<T extends WritableProjectSettingsType> = (
  form: FormStateMap[T],
  id?: string,
) => ProjectSettingsInput;

const { EventLog, ...WritableProjectSettingsTabs } = ProjectSettingsTabRoutes;
export { WritableProjectSettingsTabs };

export type WritableProjectSettingsType =
  (typeof WritableProjectSettingsTabs)[keyof typeof WritableProjectSettingsTabs];
