import { Analytics } from "analytics/addPageAction";
import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import {
  EditSpawnHostMutationVariables,
  SpawnHostMutationVariables,
  SpawnVolumeMutationVariables,
  UpdateVolumeMutationVariables,
} from "gql/generated/types";

type Action =
  | { name: "Copy SSH Command" }
  | { name: "Change Host Status"; status: string }
  | { name: "Toggle Spawn Host Details"; expanded: boolean }
  | { name: "Change Tab"; tab: string }
  | { name: "Opened the Spawn Host Modal" }
  | { name: "Open the Edit Spawn Host Modal"; hostId: string; status: string }
  | { name: "Edited a Spawn Host"; params: EditSpawnHostMutationVariables }
  | {
      name: "Spawned a host";
      isMigration: boolean;
      params: Omit<
        SpawnHostMutationVariables["spawnHostInput"],
        "publicKey" | "userDataScript" | "setUpScript"
      >;
    }
  | { name: "Opened the Spawn Volume Modal" }
  | { name: "Mount volume to host"; volumeId: string; hostId: string }
  | { name: "Delete volume"; volumeId: string }
  | { name: "Unmount volume"; volumeId: string }
  | {
      name: "Spawned a volume";
      params: SpawnVolumeMutationVariables["spawnVolumeInput"];
    }
  | {
      name: "Edited a Spawn Volume";
      params: UpdateVolumeMutationVariables["updateVolumeInput"];
    }
  | { name: "Opened IDE" };

export const useSpawnAnalytics = () => useAnalyticsRoot<Action>("SpawnPages");

type SpawnHostAnalytics = Analytics<Action>;

export type { SpawnHostAnalytics as Analytics };
