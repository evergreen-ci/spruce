export type SettingsRoutes = string;
export type FormToGqlFunction<T extends SettingsRoutes> = (
  form: Record<T, any>,
  id?: string,
) => any;
