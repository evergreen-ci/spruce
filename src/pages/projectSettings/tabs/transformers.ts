import { ProjectSettingsTabRoutes } from "constants/routes";
import * as access from "./AccessTab/transformers";
import * as containers from "./ContainersTab/transformers";
import * as general from "./GeneralTab/transformers";
import * as githubCommitQueue from "./GithubCommitQueueTab/transformers";
import * as notifications from "./NotificationsTab/transformers";
import * as patchAliases from "./PatchAliasesTab/transformers";
import * as periodicBuilds from "./PeriodicBuildsTab/transformers";
import * as plugins from "./PluginsTab/transformers";
import * as projectTriggers from "./ProjectTriggersTab/transformers";
import {
  FormToGqlFunction,
  GqlToFormFunction,
  WritableProjectSettingsType,
} from "./types";
import * as variables from "./VariablesTab/transformers";
import * as viewsAndFilters from "./ViewsAndFiltersTab/transformers";
import * as virtualWorkstation from "./VirtualWorkstationTab/transformers";

export const gqlToFormMap: {
  [T in WritableProjectSettingsType]: GqlToFormFunction<T>;
} = {
  [ProjectSettingsTabRoutes.General]: general.gqlToForm,
  [ProjectSettingsTabRoutes.Access]: access.gqlToForm,
  [ProjectSettingsTabRoutes.Plugins]: plugins.gqlToForm,
  [ProjectSettingsTabRoutes.Variables]: variables.gqlToForm,
  [ProjectSettingsTabRoutes.GithubCommitQueue]: githubCommitQueue.gqlToForm,
  [ProjectSettingsTabRoutes.Notifications]: notifications.gqlToForm,
  [ProjectSettingsTabRoutes.PatchAliases]: patchAliases.gqlToForm,
  [ProjectSettingsTabRoutes.VirtualWorkstation]: virtualWorkstation.gqlToForm,
  [ProjectSettingsTabRoutes.ProjectTriggers]: projectTriggers.gqlToForm,
  [ProjectSettingsTabRoutes.PeriodicBuilds]: periodicBuilds.gqlToForm,
  [ProjectSettingsTabRoutes.Containers]: containers.gqlToForm,
  [ProjectSettingsTabRoutes.ViewsAndFilters]: viewsAndFilters.gqlToForm,
};

export const formToGqlMap: {
  [T in WritableProjectSettingsType]: FormToGqlFunction<T>;
} = {
  [ProjectSettingsTabRoutes.General]: general.formToGql,
  [ProjectSettingsTabRoutes.Access]: access.formToGql,
  [ProjectSettingsTabRoutes.Plugins]: plugins.formToGql,
  [ProjectSettingsTabRoutes.Variables]: variables.formToGql,
  [ProjectSettingsTabRoutes.GithubCommitQueue]: githubCommitQueue.formToGql,
  [ProjectSettingsTabRoutes.Notifications]: notifications.formToGql,
  [ProjectSettingsTabRoutes.PatchAliases]: patchAliases.formToGql,
  [ProjectSettingsTabRoutes.VirtualWorkstation]: virtualWorkstation.formToGql,
  [ProjectSettingsTabRoutes.ProjectTriggers]: projectTriggers.formToGql,
  [ProjectSettingsTabRoutes.PeriodicBuilds]: periodicBuilds.formToGql,
  [ProjectSettingsTabRoutes.Containers]: containers.formToGql,
  [ProjectSettingsTabRoutes.ViewsAndFilters]: viewsAndFilters.formToGql,
};
