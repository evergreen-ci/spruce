import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { pollInterval } from "constants/index";
import { useBannerDispatchContext } from "context/banners";
import { MyHostsQuery, MyHostsQueryVariables } from "gql/generated/types";
import { GET_MY_HOSTS } from "gql/queries";
import { useNetworkStatus } from "hooks/useNetworkStatus";

interface HostOption {
  key: string;
  displayName: string;
}

interface Props {
  targetAvailabilityZone: string;
}

export const useMountVolumeSelect = ({ targetAvailabilityZone }: Props) => {
  const dispatchBanner = useBannerDispatchContext();
  const [hostOptions, setHostOptions] = useState<HostOption[]>([]); // dropdown option
  const [selectedHostId, setSelectedHostId] = useState(""); // selected dropdown item
  const { data, loading, startPolling, stopPolling } = useQuery<
    MyHostsQuery,
    MyHostsQueryVariables
  >(GET_MY_HOSTS, {
    pollInterval,
    onError: (e) => {
      dispatchBanner.errorBanner(
        `There was an error loading hosts: ${e.message}`
      );
    },
  });
  useNetworkStatus(startPolling, stopPolling);

  // set host dropdown options
  useEffect(() => {
    if (data?.myHosts) {
      const opts = data.myHosts
        // Filter hosts that do not have the same availability zone as the volume.
        .filter(
          ({ availabilityZone }) => availabilityZone === targetAvailabilityZone
        )
        // Map host to a displayName and ID for the dropdown <Option />
        .map((host) => ({
          key: host.id,
          displayName: host.displayName ? host.displayName : host.id,
        }))
        // Sort the dropdown items by display name.
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
      setHostOptions(opts);
    }
  }, [data, targetAvailabilityZone]);

  // set initially selected host in dropdown
  useEffect(() => {
    if (!selectedHostId && hostOptions.length) {
      setSelectedHostId(hostOptions[0].key);
    }
  }, [hostOptions, selectedHostId]);

  return {
    loading,
    hostOptions,
    selectedHostId,
    setSelectedHostId,
  };
};
