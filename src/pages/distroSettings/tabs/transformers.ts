import { DistroSettingsTabRoutes } from "constants/routes";
import { DistroInput } from "gql/generated/types";
import * as general from "./GeneralTab/transformers";
import * as project from "./ProjectTab/transformers";
import * as provider from "./ProviderTab/transformers";
import * as task from "./TaskTab/transformers";
import {
  FormToGqlFunction,
  GqlToFormFunction,
  WritableDistroSettingsType,
} from "./types";

// TODO: Update maps as transformation functions are added and remove dummy return value.
const fakeReturn = {} as DistroInput;

export const formToGqlMap: {
  [T in WritableDistroSettingsType]: FormToGqlFunction<T>;
} = {
  [DistroSettingsTabRoutes.General]: general.formToGql,
  [DistroSettingsTabRoutes.Host]: () => fakeReturn,
  [DistroSettingsTabRoutes.Project]: project.formToGql,
  [DistroSettingsTabRoutes.Provider]: provider.formToGql,
  [DistroSettingsTabRoutes.Task]: task.formToGql,
};

export const gqlToFormMap: {
  [T in WritableDistroSettingsType]?: GqlToFormFunction<T>;
} = {
  [DistroSettingsTabRoutes.General]: general.gqlToForm,
  [DistroSettingsTabRoutes.Host]: () => fakeReturn,
  [DistroSettingsTabRoutes.Project]: project.gqlToForm,
  [DistroSettingsTabRoutes.Provider]: provider.gqlToForm,
  [DistroSettingsTabRoutes.Task]: task.gqlToForm,
};
