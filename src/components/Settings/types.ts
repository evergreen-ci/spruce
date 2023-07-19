import { WritableProjectSettingsType } from "pages/projectSettings/tabs/types";

export type SettingsRoutes = WritableProjectSettingsType;
export type FormToGqlFunction<T extends SettingsRoutes> = (
  form: Record<T, any>,
  id?: string
) => any;
