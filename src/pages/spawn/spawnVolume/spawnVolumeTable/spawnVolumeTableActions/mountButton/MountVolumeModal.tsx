import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Variant } from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Select } from "antd";
import { Modal } from "components/Modal";
import { ModalContent, Section, WideButton } from "components/Spawn";
import { InputLabel } from "components/styles";
import { pollInterval } from "constants/index";
import { useBannerDispatchContext } from "context/banners";
import {
  AttachVolumeToHostMutation,
  AttachVolumeToHostMutationVariables,
  MyHostsQuery,
  MyHostsQueryVariables,
  MyVolumesQuery,
} from "gql/generated/types";
import { ATTACH_VOLUME } from "gql/mutations/attach-volume";
import { GET_MY_HOSTS } from "gql/queries";
import { useNetworkStatus } from "hooks";

const { Option } = Select;

type Volume = MyVolumesQuery["myVolumes"][0];

interface Props {
  visible: boolean;
  onCancel: () => void;
  volume: Volume;
}
interface HostOption {
  key: string;
  displayName: string;
}

export const MountVolumeModal: React.FC<Props> = ({
  visible,
  onCancel,
  volume,
}) => {
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
      console.log(e);
    },
  });
  useNetworkStatus(startPolling, stopPolling);
  const targetAvailabilityZone = volume.availabilityZone;
  useEffect(() => {
    if (data?.myHosts) {
      const opts = data.myHosts
        .filter(
          ({ availabilityZone }) => availabilityZone === targetAvailabilityZone
        )
        .map((host) => ({
          key: host.id,
          displayName: host.displayName ? host.displayName : host.id,
        }))
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

  const [attachVolume, { loading: loadingAttachVolume }] = useMutation<
    AttachVolumeToHostMutation,
    AttachVolumeToHostMutationVariables
  >(ATTACH_VOLUME, {
    onError: (err) =>
      dispatchBanner.errorBanner(`Error attaching volume: '${err.message}'`),
    refetchQueries: ["myVolumes"],
  });
  console.log(visible);
  return (
    <Modal
      title="Attach Volume to Host"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <WideButton key={0} onClick={onCancel}>
          Cancel
        </WideButton>,
        <WideButton
          key={1}
          data-cy="mount-volume-button"
          disabled={!selectedHostId || loadingAttachVolume || loading}
          onClick={() => {
            attachVolume({
              variables: {
                volumeAndHost: {
                  volumeId: volume.id,
                  hostId: selectedHostId,
                },
              },
            });
            onCancel();
          }}
          variant={Variant.Primary}
        >
          Mount
        </WideButton>,
      ]}
      data-cy="mount-volume-modal"
    >
      <ModalContent>
        <Section>
          <InputLabel htmlFor="hostDropdown">Host Name</InputLabel>
          <Select
            id="hostDropdown"
            defaultValue={selectedHostId}
            onChange={(newValue) => setSelectedHostId(newValue)}
            data-cy="host-select"
          >
            {hostOptions.map(({ key, displayName }) => (
              <Option value={key} key={key} data-cy={`${key}-option`}>
                {displayName}
              </Option>
            ))}
          </Select>
        </Section>
        <StyledDisclaimer>
          {`Only shows running hosts in zone ${targetAvailabilityZone}.`}
        </StyledDisclaimer>
      </ModalContent>
    </Modal>
  );
};

const StyledDisclaimer = styled(Disclaimer)`
  padding-top: 8px;
`;
