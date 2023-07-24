import { DistroSettingsTabRoutes } from "constants/routes";
import { DistroQuery, SaveDistroInput } from "gql/generated/types";

const { EventLog, ...WritableDistroSettingsTabs } = DistroSettingsTabRoutes;
export { WritableDistroSettingsTabs };

export type WritableDistroSettingsType =
  (typeof WritableDistroSettingsTabs)[keyof typeof WritableDistroSettingsTabs];

export type FormStateMap = {
  [T in WritableDistroSettingsType]: {
    [DistroSettingsTabRoutes.General]: any;
    [DistroSettingsTabRoutes.Provider]: any;
    [DistroSettingsTabRoutes.Task]: any;
    [DistroSettingsTabRoutes.Host]: any;
    [DistroSettingsTabRoutes.Project]: any;
  }[T];
};

export type FormToGqlFunction<T extends WritableDistroSettingsType> = (
  form: FormStateMap[T],
  id?: string
) => SaveDistroInput; // TODO: Remove | null

export type GqlToFormFunction<T extends WritableDistroSettingsType> = (
  data: DistroQuery["distro"]
) => FormStateMap[T];
