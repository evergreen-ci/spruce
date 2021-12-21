import { ProjectSettingsTabRoutes } from "constants/routes";
import { PartialRecord } from "types/utils";
import * as access from "./AccessTab/transformers";
import * as general from "./GeneralTab/transformers";
import {
  FormToGqlFunction,
  GqlToFormFunction,
  WritableTabRoutes,
} from "./types";

// TODO: Convert PartialRecord to Record once all tabs have been implemented.
export const gqlToFormMap: PartialRecord<
  WritableTabRoutes,
  GqlToFormFunction
> = {
  [ProjectSettingsTabRoutes.General]: general.gqlToForm,
  [ProjectSettingsTabRoutes.Access]: access.gqlToForm,
};

// TODO: Convert PartialRecord to Record once all tabs have been implemented.
export const formToGqlMap: PartialRecord<
  WritableTabRoutes,
  FormToGqlFunction
> = {
  [ProjectSettingsTabRoutes.General]: general.formToGql,
  [ProjectSettingsTabRoutes.Access]: access.formToGql,
};
