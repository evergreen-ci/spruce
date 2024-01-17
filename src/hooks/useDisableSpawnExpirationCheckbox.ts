import { useQuery } from "@apollo/client";
import {
  MyHostsQuery,
  MyHostsQueryVariables,
  MyVolumesQuery,
  MyVolumesQueryVariables,
} from "gql/generated/types";
import { MY_HOSTS, MY_VOLUMES } from "gql/queries";
import { useSpruceConfig } from "./useSpruceConfig";

type ListItem =
  | MyHostsQuery["myHosts"][0]
  | MyVolumesQuery["myVolumes"][0]
  | { noExpiration?: boolean };

const countNoExpirationCB = (accum: number, currItem: ListItem) =>
  accum + (currItem.noExpiration ? 1 : 0);

export const useDisableSpawnExpirationCheckbox = (
  isVolume: boolean,
  targetItem?: { noExpiration?: boolean }, // Target item represents a host or volume being edited.
) => {
  const { data: MyHostsData } = useQuery<MyHostsQuery, MyHostsQueryVariables>(
    MY_HOSTS,
  );
  const { data: MyVolumesData } = useQuery<
    MyVolumesQuery,
    MyVolumesQueryVariables
  >(MY_VOLUMES);

  const spruceConfig = useSpruceConfig();
  const currentUnexpirableCount = (
    (isVolume ? MyVolumesData?.myVolumes : MyHostsData?.myHosts) ??
    ([] as ListItem[])
  ).reduce(countNoExpirationCB, 0);

  const { unexpirableHostsPerUser, unexpirableVolumesPerUser } =
    spruceConfig?.spawnHost ?? {};

  const maxUnexpirable =
    (isVolume ? unexpirableVolumesPerUser : unexpirableHostsPerUser) ?? 0;

  const maxReached = currentUnexpirableCount >= (maxUnexpirable ?? 0);
  return targetItem ? maxReached && !targetItem.noExpiration : maxReached;
};
