import { ProjectSettingsTabRoutes } from "constants/routes";
import { PartialRecord } from "types/utils";
import * as access from "./AccessTab/transformers";
import * as general from "./GeneralTab/transformers";
import * as githubCommitQueue from "./GithubCommitQueue/transformers";
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
  [ProjectSettingsTabRoutes.Variables]: variables.gqlToForm,
  [ProjectSettingsTabRoutes.GithubCommitQueue]: githubCommitQueue.gqlToForm,
};

// TODO: Convert PartialRecord to Record once all tabs have been implemented.
export const formToGqlMap: PartialRecord<
  WritableTabRoutes,
  FormToGqlFunction
> = {
  [ProjectSettingsTabRoutes.General]: general.formToGql,
  [ProjectSettingsTabRoutes.Access]: access.formToGql,
  [ProjectSettingsTabRoutes.Variables]: variables.formToGql,
  [ProjectSettingsTabRoutes.GithubCommitQueue]: githubCommitQueue.formToGql,
};
