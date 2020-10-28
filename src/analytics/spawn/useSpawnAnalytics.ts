import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import {
  EditSpawnHostMutationVariables,
  SpawnHostMutationVariables,
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
  | { name: "Spawned a host"; params: SpawnHostMutationVariables }
  | { name: "Edited a Spawn Volume"; params: UpdateVolumeMutationVariables };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useSpawnAnalytics = (): Analytics => {
  const userId = useGetUserQuery();

  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "SpawnPages",
      userId,
    });
  };

  return { sendEvent };
};
