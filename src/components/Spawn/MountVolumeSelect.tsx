import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Select } from "antd";
import { ModalContent } from "components/Spawn";
import { InputLabel } from "components/styles";
import { pollInterval } from "constants/index";
import { useToastContext } from "context/toast";
import { MyHostsQuery, MyHostsQueryVariables } from "gql/generated/types";
import { GET_MY_HOSTS } from "gql/queries";
import { usePollForQueries } from "hooks";
import { HostStatus } from "types/host";

const { Option } = Select;
interface HostOption {
  id: string;
  displayName: string;
}

interface Props {
  targetAvailabilityZone: string;
  selectedHostId: string;
  onChange: (hostId: string) => void;
  label?: string;
  autofill?: boolean;
}

export const MountVolumeSelect = ({
  targetAvailabilityZone,
  selectedHostId,
  onChange,
  label,
  autofill,
}: Props) => {
  const dispatchToast = useToastContext();
  const [hostOptions, setHostOptions] = useState<HostOption[]>([]); // dropdown option
  const { data, startPolling, stopPolling } = useQuery<
    MyHostsQuery,
    MyHostsQueryVariables
  >(GET_MY_HOSTS, {
    pollInterval,
    onError: (e) => {
      dispatchToast.error(`There was an error loading hosts: ${e.message}`);
    },
  });
  usePollForQueries(startPolling, stopPolling);

  // set host dropdown options
  useEffect(() => {
    // User should not be able to make changes to a host if it isn't in the running or stopped status and the host is not in the wrong availability zone
    const canUpdateHost = (status: string, availabilityZone: string) =>
      availabilityZone === targetAvailabilityZone &&
      (status === HostStatus.Running || status === HostStatus.Stopped);
    if (data?.myHosts) {
      const opts = data.myHosts
        // Filter hosts that do not have the same availability zone as the volume.
        .filter(({ availabilityZone, status }) =>
          canUpdateHost(status, availabilityZone)
        )
        // Map host to a displayName and ID for the dropdown <Option />
        .map(({ id, displayName }) => ({
          id,
          displayName: displayName || id,
        }))
        // Sort the dropdown items by display name.
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
      setHostOptions(opts);
    }
  }, [data, targetAvailabilityZone]);

  // set initially selected host in dropdown
  useEffect(() => {
    if (!selectedHostId && hostOptions.length && autofill) {
      onChange(hostOptions[0].id);
    }
  }, [hostOptions, selectedHostId, onChange, autofill]);

  return (
    <ModalContent>
      <InputLabel htmlFor="hostDropdown">{label || "Host Name"}</InputLabel>
      <Select
        id="hostDropdown"
        value={selectedHostId}
        style={{ width: 200 }}
        onChange={onChange}
        data-cy="host-select"
      >
        {!autofill && (
          <Option value="" key="clear" data-cy="clear-option">
            {" "}
          </Option>
        )}
        {hostOptions.map(({ id, displayName }) => (
          <Option value={id} key={id} data-cy={`${id}-option`}>
            {displayName}
          </Option>
        ))}
      </Select>
    </ModalContent>
  );
};
