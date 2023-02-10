import { useQuery } from "@apollo/client";
import { volumeTypes } from "constants/volumes";
import {
  SubnetAvailabilityZonesQuery,
  SubnetAvailabilityZonesQueryVariables,
  MyVolumesQuery,
  MyVolumesQueryVariables,
  MyHostsQuery,
  MyHostsQueryVariables,
} from "gql/generated/types";
import {
  GET_SUBNET_AVAILABILITY_ZONES,
  GET_MY_VOLUMES,
  GET_MY_HOSTS,
} from "gql/queries";
import { useDisableSpawnExpirationCheckbox, useSpruceConfig } from "hooks";
import { getNoExpirationCheckboxTooltipCopy } from "../utils";

export const useLoadFormData = () => {
  const spruceConfig = useSpruceConfig();

  // QUERY volumes
  const { data: volumesData, loading: volumesLoading } = useQuery<
    MyVolumesQuery,
    MyVolumesQueryVariables
  >(GET_MY_VOLUMES);

  const volumeLimit = spruceConfig?.providers?.aws?.maxVolumeSizePerUser;
  const totalVolumeSize = volumesData?.myVolumes?.reduce(
    (cnt, v) => cnt + v.size,
    0
  );
  const maxSpawnableLimit =
    volumeLimit - totalVolumeSize >= 0 ? volumeLimit - totalVolumeSize : 0;

  // QUERY hosts
  const { data: hostsData, loading: hostsLoading } = useQuery<
    MyHostsQuery,
    MyHostsQueryVariables
  >(GET_MY_HOSTS);
  const hosts = hostsData?.myHosts ?? [];

  // QUERY availability zones
  const { data: availabilityZoneData, loading: availabilityZonesLoading } =
    useQuery<
      SubnetAvailabilityZonesQuery,
      SubnetAvailabilityZonesQueryVariables
    >(GET_SUBNET_AVAILABILITY_ZONES);
  const availabilityZones = availabilityZoneData?.subnetAvailabilityZones ?? [];

  const disableExpirationCheckbox = useDisableSpawnExpirationCheckbox(false);

  const noExpirationCheckboxTooltip = getNoExpirationCheckboxTooltipCopy({
    disableExpirationCheckbox,
    limit: spruceConfig?.spawnHost?.unexpirableHostsPerUser,
    isVolume: true,
  });

  return {
    availabilityZones,
    types: volumeTypes,
    hosts,
    volumesData,
    disableExpirationCheckbox,
    noExpirationCheckboxTooltip,
    maxSpawnableLimit,
    loadingFormData: volumesLoading || hostsLoading || availabilityZonesLoading,
  };
};
