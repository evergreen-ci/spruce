import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm/types";
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
  [T in WritableTabRoutes]: {
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

export type GetFormSchema = (...any) => {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
};

export type TabDataProps = {
  [T in WritableTabRoutes]: {
    projectData: FormStateMap[T];
    repoData: FormStateMap[T];
  };
};

export type GqlToFormFunction<T extends WritableTabRoutes> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  options?: { projectType?: ProjectType }
) => FormStateMap[T];

export type FormToGqlFunction<T extends WritableTabRoutes> = (
  form: FormStateMap[T],
  id?: string
) => ProjectSettingsInput;

const { EventLog, ...Writable } = ProjectSettingsTabRoutes;
export { Writable };

export type WritableTabRoutes = (typeof Writable)[keyof typeof Writable];

export const projectOnlyTabs: Set<ProjectSettingsTabRoutes> = new Set([
  ProjectSettingsTabRoutes.ViewsAndFilters,
]);
