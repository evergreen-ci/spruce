import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectSettingsInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import * as access from "./AccessTab/types";
import * as general from "./GeneralTab/types";
import * as githubCommitQueue from "./GithubCommitQueueTab/types";
import * as notifications from "./NotificationsTab/types";
import * as patchAliases from "./PatchAliasesTab/types";
import * as periodicBuilds from "./PeriodicBuildsTab/types";
import * as plugins from "./PluginsTab/types";
import * as projectTriggers from "./ProjectTriggersTab/types";
import { ProjectType } from "./utils";
import * as variables from "./VariablesTab/types";
import * as virtualWorkstation from "./VirtualWorkstationTab/types";

export type FormStateMap = {
  [ProjectSettingsTabRoutes.General]: general.FormState;
  [ProjectSettingsTabRoutes.Access]: access.FormState;
  [ProjectSettingsTabRoutes.Plugins]: plugins.FormState;
  [ProjectSettingsTabRoutes.Variables]: variables.FormState;
  [ProjectSettingsTabRoutes.GithubCommitQueue]: githubCommitQueue.FormState;
  [ProjectSettingsTabRoutes.Notifications]: notifications.FormState;
  [ProjectSettingsTabRoutes.PatchAliases]: patchAliases.FormState;
  [ProjectSettingsTabRoutes.VirtualWorkstation]: virtualWorkstation.FormState;
  [ProjectSettingsTabRoutes.ProjectTriggers]: projectTriggers.FormState;
  [ProjectSettingsTabRoutes.PeriodicBuilds]: periodicBuilds.FormState;
};

export type GetFormSchema = (
  ...any
) => {
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

export const readOnlyTabs = [ProjectSettingsTabRoutes.EventLog] as const;

type ReadOnlyTabs = typeof readOnlyTabs[number];

export type WritableTabRoutes = Exclude<ProjectSettingsTabRoutes, ReadOnlyTabs>;
