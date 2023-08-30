import { DistroSettingsTabRoutes } from "constants/routes";
import { DistroQuery, DistroInput } from "gql/generated/types";
import { GeneralFormState } from "./GeneralTab/types";
import { HostFormState } from "./HostTab/types";
import { ProjectFormState } from "./ProjectTab/types";
import { TaskFormState } from "./TaskTab/types";

const { EventLog, ...WritableDistroSettingsTabs } = DistroSettingsTabRoutes;
export { WritableDistroSettingsTabs };

export type WritableDistroSettingsType =
  (typeof WritableDistroSettingsTabs)[keyof typeof WritableDistroSettingsTabs];

// TODO: Specify type as tabs are added.
export type FormStateMap = {
  [T in WritableDistroSettingsType]: {
    [DistroSettingsTabRoutes.General]: GeneralFormState;
    [DistroSettingsTabRoutes.Provider]: any;
    [DistroSettingsTabRoutes.Task]: TaskFormState;
    [DistroSettingsTabRoutes.Host]: HostFormState;
    [DistroSettingsTabRoutes.Project]: ProjectFormState;
  }[T];
};

export type FormToGqlFunction<T extends WritableDistroSettingsType> = (
  form: FormStateMap[T],
  distro: DistroQuery["distro"]
) => DistroInput;

export type GqlToFormFunction<T extends WritableDistroSettingsType> = (
  data: DistroQuery["distro"]
) => FormStateMap[T];
