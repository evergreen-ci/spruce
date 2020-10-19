import React from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Variant } from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Select } from "antd";
import { Modal } from "components/Modal";
import { ModalContent, Section, WideButton } from "components/Spawn";
import { InputLabel } from "components/styles";
import { useBannerDispatchContext } from "context/banners";
import {
  AttachVolumeToHostMutation,
  AttachVolumeToHostMutationVariables,
} from "gql/generated/types";
import { ATTACH_VOLUME } from "gql/mutations/attach-volume";
import { useMountVolumeSelect } from "hooks/useMountVolumeSelect";
import { MyVolume } from "types/spawn";

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  volume: MyVolume;
}

export const MountVolumeModal: React.FC<Props> = ({
  visible,
  onCancel,
  volume,
}) => {
  const dispatchBanner = useBannerDispatchContext();
  const targetAvailabilityZone = volume.availabilityZone;
  const {
    loading,
    hostOptions,
    selectedHostId,
    setSelectedHostId,
  } = useMountVolumeSelect({ targetAvailabilityZone });
  const [attachVolume, { loading: loadingAttachVolume }] = useMutation<
    AttachVolumeToHostMutation,
    AttachVolumeToHostMutationVariables
  >(ATTACH_VOLUME, {
    onError: (err) =>
      dispatchBanner.errorBanner(`Error attaching volume: '${err.message}'`),
    onCompleted: () => {
      dispatchBanner.successBanner("Successfully mounted the volume.");
    },
    refetchQueries: ["myVolumes"],
  });
  return (
    <Modal
      title="Attach Volume to Host"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <WideButton key="cancel" onClick={onCancel}>
          Cancel
        </WideButton>,
        <WideButton
          key="mount"
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
