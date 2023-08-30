import { DistroSettingsTabRoutes } from "constants/routes";
import * as general from "./GeneralTab/transformers";
import * as host from "./HostTab/transformers";
import * as project from "./ProjectTab/transformers";
import * as provider from "./ProviderTab/transformers";
import * as task from "./TaskTab/transformers";
import {
  FormToGqlFunction,
  GqlToFormFunction,
  WritableDistroSettingsType,
} from "./types";

export const formToGqlMap: {
  [T in WritableDistroSettingsType]: FormToGqlFunction<T>;
} = {
  [DistroSettingsTabRoutes.General]: general.formToGql,
  [DistroSettingsTabRoutes.Host]: host.formToGql,
  [DistroSettingsTabRoutes.Project]: project.formToGql,
  [DistroSettingsTabRoutes.Provider]: provider.formToGql,
  [DistroSettingsTabRoutes.Task]: task.formToGql,
};

export const gqlToFormMap: {
  [T in WritableDistroSettingsType]?: GqlToFormFunction<T>;
} = {
  [DistroSettingsTabRoutes.General]: general.gqlToForm,
  [DistroSettingsTabRoutes.Host]: host.gqlToForm,
  [DistroSettingsTabRoutes.Project]: project.gqlToForm,
  [DistroSettingsTabRoutes.Provider]: provider.gqlToForm,
  [DistroSettingsTabRoutes.Task]: task.gqlToForm,
};
