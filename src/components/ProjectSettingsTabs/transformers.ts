import { ProjectSettingsTabRoutes } from "constants/routes";
import * as access from "./AccessTab/transformers";
import * as general from "./GeneralTab/transformers";
import * as githubCommitQueue from "./GithubCommitQueueTab/transformers";
import * as notifications from "./NotificationsTab/transformers";
import * as patchAliases from "./PatchAliasesTab/transformers";
import * as plugins from "./PluginsTab/transformers";
import { CompletedRoutes, FormToGqlFunction, GqlToFormFunction } from "./types";
import * as variables from "./VariablesTab/transformers";
import * as virtualWorkstation from "./VirtualWorkstationTab/transformers";

// TODO: Convert CompletedRoutes to WritableRoutes once all tabs have been implemented.
export const gqlToFormMap: Record<CompletedRoutes, GqlToFormFunction> = {
  [ProjectSettingsTabRoutes.General]: general.gqlToForm,
  [ProjectSettingsTabRoutes.Access]: access.gqlToForm,
  [ProjectSettingsTabRoutes.Plugins]: plugins.gqlToForm,
  [ProjectSettingsTabRoutes.Variables]: variables.gqlToForm,
  [ProjectSettingsTabRoutes.GithubCommitQueue]: githubCommitQueue.gqlToForm,
  [ProjectSettingsTabRoutes.Notifications]: notifications.gqlToForm,
  [ProjectSettingsTabRoutes.PatchAliases]: patchAliases.gqlToForm,
  [ProjectSettingsTabRoutes.VirtualWorkstation]: virtualWorkstation.gqlToForm,
};

// TODO: Convert CompletedRoutes to WritableRoutes once all tabs have been implemented.
export const formToGqlMap: Record<CompletedRoutes, FormToGqlFunction> = {
  [ProjectSettingsTabRoutes.General]: general.formToGql,
  [ProjectSettingsTabRoutes.Access]: access.formToGql,
  [ProjectSettingsTabRoutes.Plugins]: plugins.formToGql,
  [ProjectSettingsTabRoutes.Variables]: variables.formToGql,
  [ProjectSettingsTabRoutes.GithubCommitQueue]: githubCommitQueue.formToGql,
  [ProjectSettingsTabRoutes.Notifications]: notifications.formToGql,
  [ProjectSettingsTabRoutes.PatchAliases]: patchAliases.formToGql,
  [ProjectSettingsTabRoutes.VirtualWorkstation]: virtualWorkstation.formToGql,
};
