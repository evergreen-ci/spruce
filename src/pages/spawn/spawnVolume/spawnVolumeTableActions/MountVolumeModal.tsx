import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Disclaimer } from "@leafygreen-ui/typography";
import { useSpawnAnalytics } from "analytics/spawn/useSpawnAnalytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { ModalContent, MountVolumeSelect } from "components/Spawn";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  AttachVolumeToHostMutation,
  AttachVolumeToHostMutationVariables,
} from "gql/generated/types";
import { ATTACH_VOLUME } from "gql/mutations";
import { MyVolume } from "types/spawn";

interface Props {
  visible: boolean;
  onCancel: () => void;
  volume: MyVolume;
}

export const MountVolumeModal: React.FC<Props> = ({
  onCancel,
  visible,
  volume,
}) => {
  const dispatchToast = useToastContext();
  const spawnAnalytics = useSpawnAnalytics();
  const [attachVolume, { loading: loadingAttachVolume }] = useMutation<
    AttachVolumeToHostMutation,
    AttachVolumeToHostMutationVariables
  >(ATTACH_VOLUME, {
    onError: (err) =>
      dispatchToast.error(`Error attaching volume: '${err.message}'`),
    onCompleted: () => {
      dispatchToast.success("Successfully mounted the volume.");
    },
    refetchQueries: ["MyVolumes", "MyHosts"],
  });
  const targetAvailabilityZone = volume.availabilityZone;
  const [selectedHostId, setSelectedHostId] = useState("");
  return (
    <ConfirmationModal
      title="Attach Volume to Host"
      open={visible}
      onCancel={onCancel}
      onConfirm={() => {
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
      submitDisabled={!selectedHostId || loadingAttachVolume}
      buttonText="Mount"
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
    </ConfirmationModal>
  );
};

const StyledDisclaimer = styled(Disclaimer)`
  padding-top: ${size.xs};
`;
