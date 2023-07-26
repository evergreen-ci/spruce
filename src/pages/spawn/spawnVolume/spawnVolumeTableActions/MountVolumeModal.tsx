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

export const MountVolumeModal: React.VFC<Props> = ({
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
    onCompleted: () => {
      dispatchToast.success("Successfully mounted the volume.");
    },
    onError: (err) =>
      dispatchToast.error(`Error attaching volume: '${err.message}'`),
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
          hostId: selectedHostId,
          name: "Mount volume to host",
          volumeId: volume.id,
        });
        attachVolume({
          variables: {
            volumeAndHost: {
              hostId: selectedHostId,
              volumeId: volume.id,
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
