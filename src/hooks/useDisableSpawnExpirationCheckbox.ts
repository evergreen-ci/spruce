import { useQuery } from "@apollo/client";
import {
  GetSpruceConfigQuery,
  MyHostsQuery,
  MyHostsQueryVariables,
  MyVolumesQuery,
  MyVolumesQueryVariables,
  GetSpruceConfigQueryVariables,
} from "gql/generated/types";
import { GET_MY_HOSTS, GET_MY_VOLUMES, GET_SPRUCE_CONFIG } from "gql/queries";
import { MyHost, MyVolume } from "types/spawn";

type ListItem =
  | MyHostsQuery["myHosts"][0]
  | MyVolumesQuery["myVolumes"][0]
  | { noExpiration?: boolean };

const countNoExpirationCB = (accum: number, currItem: ListItem) =>
  accum + (currItem.noExpiration ? 1 : 0);

export const useDisableSpawnExpirationCheckbox = (
  isVolume: boolean,
  targetItem?: MyVolume | MyHost
) => {
  const { data: MyHostsData } = useQuery<MyHostsQuery, MyHostsQueryVariables>(
    GET_MY_HOSTS
  );
  const { data: MyVolumesData } = useQuery<
    MyVolumesQuery,
    MyVolumesQueryVariables
  >(GET_MY_VOLUMES);
  const { data: spruceConfigData } = useQuery<
    GetSpruceConfigQuery,
    GetSpruceConfigQueryVariables
  >(GET_SPRUCE_CONFIG);

  const currentUnexpirableCount = (
    (isVolume ? MyVolumesData?.myVolumes : MyHostsData?.myHosts) ??
    ([] as ListItem[])
  ).reduce(countNoExpirationCB, 0);

  const { unexpirableHostsPerUser, unexpirableVolumesPerUser } =
    spruceConfigData?.spruceConfig?.spawnHost ?? {};

  const maxUnexpirable =
    (isVolume ? unexpirableVolumesPerUser : unexpirableHostsPerUser) ?? 0;

  const maxReached = currentUnexpirableCount >= (maxUnexpirable ?? 0);
  return targetItem ? maxReached && !targetItem.noExpiration : maxReached;
};
