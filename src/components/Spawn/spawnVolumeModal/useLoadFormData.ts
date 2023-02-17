import { useQuery } from "@apollo/client";
import { volumeTypes } from "constants/volumes";
import {
  SubnetAvailabilityZonesQuery,
  SubnetAvailabilityZonesQueryVariables,
  MyHostsQuery,
  MyHostsQueryVariables,
} from "gql/generated/types";
import { GET_SUBNET_AVAILABILITY_ZONES, GET_MY_HOSTS } from "gql/queries";
import { useDisableSpawnExpirationCheckbox, useSpruceConfig } from "hooks";
import { getNoExpirationCheckboxTooltipCopy } from "../utils";

export const useLoadFormData = () => {
  const spruceConfig = useSpruceConfig();

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

  const disableExpirationCheckbox = useDisableSpawnExpirationCheckbox(true);

  const noExpirationCheckboxTooltip = getNoExpirationCheckboxTooltipCopy({
    disableExpirationCheckbox,
    limit: spruceConfig?.spawnHost?.unexpirableVolumesPerUser,
    isVolume: true,
  });

  return {
    availabilityZones,
    types: volumeTypes,
    hosts,
    disableExpirationCheckbox,
    noExpirationCheckboxTooltip,
    loadingFormData: hostsLoading || availabilityZonesLoading,
  };
};
