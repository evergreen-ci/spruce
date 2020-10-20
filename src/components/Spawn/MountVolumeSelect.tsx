import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Select } from "antd";
import { Section } from "components/Spawn";
import { InputLabel } from "components/styles";
import { pollInterval } from "constants/index";
import { useBannerDispatchContext } from "context/banners";
import { MyHostsQuery, MyHostsQueryVariables } from "gql/generated/types";
import { GET_MY_HOSTS } from "gql/queries";
import { useNetworkStatus } from "hooks/useNetworkStatus";

const { Option } = Select;
interface HostOption {
  key: string;
  displayName: string;
  label?: string;
}

interface Props {
  targetAvailabilityZone: string;
  selectedHostId: string;
  onChange: (hostId: string) => void;
  label?: string;
}

export const MountVolumeSelect = ({
  targetAvailabilityZone,
  selectedHostId,
  onChange,
  label,
}: Props) => {
  const dispatchBanner = useBannerDispatchContext();
  const [hostOptions, setHostOptions] = useState<HostOption[]>([]); // dropdown option
  const { data, startPolling, stopPolling } = useQuery<
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
      onChange(hostOptions[0].key);
    }
  }, [hostOptions, selectedHostId]);

  return (
    <Section>
      <InputLabel htmlFor="hostDropdown">{label || "Host Name"}</InputLabel>
      <Select
        id="hostDropdown"
        defaultValue={selectedHostId}
        style={{ width: 200 }}
        onChange={onChange}
        data-cy="host-select"
      >
        {hostOptions.map(({ key, displayName }) => (
          <Option value={key} key={key} data-cy={`${key}-option`}>
            {displayName}
          </Option>
        ))}
      </Select>
    </Section>
  );
};
