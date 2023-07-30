import { DistroSettingsTabRoutes } from "constants/routes";
import { SaveDistroInput } from "gql/generated/types";
import {
  FormToGqlFunction,
  GqlToFormFunction,
  WritableDistroSettingsType,
} from "./types";

// TODO: Update maps as transformation functions are added and remove dummy return value.
const fakeReturn = {} as SaveDistroInput;

export const formToGqlMap: {
  [T in WritableDistroSettingsType]: FormToGqlFunction<T>;
} = {
  [DistroSettingsTabRoutes.General]: () => fakeReturn,
  [DistroSettingsTabRoutes.Host]: () => fakeReturn,
  [DistroSettingsTabRoutes.Project]: () => fakeReturn,
  [DistroSettingsTabRoutes.Provider]: () => fakeReturn,
  [DistroSettingsTabRoutes.Task]: () => fakeReturn,
};

export const gqlToFormMap: {
  [T in WritableDistroSettingsType]?: GqlToFormFunction<T>;
} = {};
