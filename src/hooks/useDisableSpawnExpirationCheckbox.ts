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
  isVolume: boolean,
  targetItem?: MyVolume | MyHost
) => {
  const { data } = useQuery<
    SpawnExpirationInfoQuery,
    SpawnExpirationInfoQueryVariables
  >(GET_SPAWN_EXPIRATION_INFO);

  const currentUnexpirableCount = (
    (isVolume ? data?.myVolumes : data?.myHosts) ?? []
  ).reduce(countNoExpirationCB, 0);

  const { unexpirableHostsPerUser, unexpirableVolumesPerUser } =
    data?.spruceConfig?.spawnHost ?? {};

  const maxUnexpirable =
    (isVolume ? unexpirableHostsPerUser : unexpirableVolumesPerUser) ?? 0;

  const maxReached = currentUnexpirableCount >= (maxUnexpirable ?? 0);
  return targetItem ? maxReached && !targetItem.noExpiration : maxReached;
};
