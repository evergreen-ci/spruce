import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Variant } from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import { useSpawnAnalytics } from "analytics/spawn/useSpawnAnalytics";
import { Modal } from "components/Modal";
import { ModalContent, MountVolumeSelect, WideButton } from "components/Spawn";
import { useBannerDispatchContext } from "context/banners";
import {
  AttachVolumeToHostMutation,
  AttachVolumeToHostMutationVariables,
} from "gql/generated/types";
import { ATTACH_VOLUME } from "gql/mutations/attach-volume";
import { MyVolume } from "types/spawn";

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
  const spawnAnalytics = useSpawnAnalytics();
  const [attachVolume, { loading: loadingAttachVolume }] = useMutation<
    AttachVolumeToHostMutation,
    AttachVolumeToHostMutationVariables
  >(ATTACH_VOLUME, {
    onError: (err) =>
      dispatchBanner.errorBanner(`Error attaching volume: '${err.message}'`),
    onCompleted: () => {
      dispatchBanner.clearAllBanners();
      dispatchBanner.successBanner("Successfully mounted the volume.");
    },
    refetchQueries: ["MyVolumes", "MyHosts"],
  });
  const targetAvailabilityZone = volume.availabilityZone;
  const [selectedHostId, setSelectedHostId] = useState("");
  return (
    <Modal
      title="Attach Volume to Host"
      visible={visible}
      onCancel={onCancel}
      footer={[
        // @ts-expect-error
        <WideButton key="cancel" onClick={onCancel}>
          Cancel
        </WideButton>,
        <WideButton
          key="mount"
          data-cy="mount-volume-button"
          disabled={!selectedHostId || loadingAttachVolume} // @ts-expect-error
          onClick={() => {
            spawnAnalytics.sendEvent({
              name: "Mount volume to host",
              volumeId: volume.id,
              hostId: selectedHostId,
            });
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
        <MountVolumeSelect
          onChange={setSelectedHostId}
          selectedHostId={selectedHostId}
          targetAvailabilityZone={targetAvailabilityZone}
          autofill
        />
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
