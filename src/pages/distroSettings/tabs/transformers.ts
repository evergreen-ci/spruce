import { DistroSettingsTabRoutes } from "constants/routes";
import { DistroInput } from "gql/generated/types";
import * as general from "./GeneralTab/transformers";
import * as project from "./ProjectTab/transformers";
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
  [DistroSettingsTabRoutes.Provider]: () => fakeReturn,
  [DistroSettingsTabRoutes.Task]: () => fakeReturn,
};

export const gqlToFormMap: {
  [T in WritableDistroSettingsType]?: GqlToFormFunction<T>;
} = {
  [DistroSettingsTabRoutes.General]: general.gqlToForm,
  [DistroSettingsTabRoutes.Host]: () => fakeReturn,
  [DistroSettingsTabRoutes.Project]: project.gqlToForm,
  [DistroSettingsTabRoutes.Provider]: () => fakeReturn,
  [DistroSettingsTabRoutes.Task]: () => fakeReturn,
};
