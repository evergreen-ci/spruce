import {
  FormToGqlFunction as ProjectSettingsFormToGqlFunction,
  WritableTabRoutes,
} from "pages/projectSettings/tabs/types";

export type SettingsRoutes = WritableTabRoutes;
export type FormToGqlFunction<T extends SettingsRoutes> = (
  form: Record<T, any>,
  id?: string
) => any;

/* export type FormToGqlFunction<T extends SettingsRoutes> =
  ProjectSettingsFormToGqlFunction<T>; */
