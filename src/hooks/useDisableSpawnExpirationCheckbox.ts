import { useQuery } from "@apollo/client";
import {
  SpawnExpirationInfoQuery,
  SpawnExpirationInfoQueryVariables,
} from "gql/generated/types";
import { GET_SPAWN_EXPIRATION_INFO } from "gql/queries";
import { MyHost, MyVolume } from "types/spawn";

type ListItem = SpawnExpirationInfoQuery["myHosts"][0];

const countNoExpirationCB = (accum: number, currItem: ListItem) =>
  accum + (currItem.noExpiration ? 1 : 0);

export const useDisableSpawnExpirationCheckbox = (
  dataType: "VOLUME" | "HOST",
  targetItem: MyVolume | MyHost
) => {
  const { data } = useQuery<
    SpawnExpirationInfoQuery,
    SpawnExpirationInfoQueryVariables
  >(GET_SPAWN_EXPIRATION_INFO);
  const currentUnexpirableCount = (
    (dataType === "VOLUME" ? data?.myVolumes : data?.myHosts) ?? []
  ).reduce(countNoExpirationCB, 0);
  const maxUnexpirable =
    (dataType === "VOLUME"
      ? data?.spruceConfig?.spawnHost.unexpirableHostsPerUser
      : data?.spruceConfig?.spawnHost.unexpirableVolumesPerUser) ?? 0;
  const maxReached = currentUnexpirableCount >= (maxUnexpirable ?? 0);
  return targetItem ? maxReached && !targetItem.noExpiration : maxReached;
};
