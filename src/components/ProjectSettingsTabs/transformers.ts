import { ProjectSettingsTabRoutes } from "constants/routes";
import { PartialRecord } from "types/utils";
import * as access from "./AccessTab/transformers";
import * as general from "./GeneralTab/transformers";
import * as githubCommitQueue from "./GithubCommitQueueTab/transformers";
import * as notifications from "./NotificationsTab/transformers";
import * as plugins from "./PluginsTab/transformers";
import {
  FormToGqlFunction,
  GqlToFormFunction,
  WritableTabRoutes,
} from "./types";
import * as variables from "./VariablesTab/transformers";

// TODO: Convert PartialRecord to Record once all tabs have been implemented.
export const gqlToFormMap: PartialRecord<
  WritableTabRoutes,
  GqlToFormFunction
> = {
  [ProjectSettingsTabRoutes.General]: general.gqlToForm,
  [ProjectSettingsTabRoutes.Access]: access.gqlToForm,
  [ProjectSettingsTabRoutes.Plugins]: plugins.gqlToForm,
  [ProjectSettingsTabRoutes.Variables]: variables.gqlToForm,
  [ProjectSettingsTabRoutes.GithubCommitQueue]: githubCommitQueue.gqlToForm,
  [ProjectSettingsTabRoutes.Notifications]: notifications.gqlToForm,
};

// TODO: Convert PartialRecord to Record once all tabs have been implemented.
export const formToGqlMap: PartialRecord<
  WritableTabRoutes,
  FormToGqlFunction
> = {
  [ProjectSettingsTabRoutes.General]: general.formToGql,
  [ProjectSettingsTabRoutes.Access]: access.formToGql,
  [ProjectSettingsTabRoutes.Plugins]: plugins.formToGql,
  [ProjectSettingsTabRoutes.Variables]: variables.formToGql,
  [ProjectSettingsTabRoutes.GithubCommitQueue]: githubCommitQueue.formToGql,
  [ProjectSettingsTabRoutes.Notifications]: notifications.formToGql,
};
