import React, { useReducer } from "react";
import { useMutation } from "@apollo/client";
import { Variant } from "@leafygreen-ui/button";
import { Subtitle } from "@leafygreen-ui/typography";
import { Modal } from "components/Modal";
import {
  MountVolumeSelect,
  SectionContainer,
  SectionLabel,
  WideButton,
} from "components/Spawn";
import { ExpirationField } from "components/Spawn/ExpirationField";
import { HR } from "components/styles/Layout";
import { useBannerDispatchContext } from "context/banners";
import {
  SpawnVolumeMutation,
  SpawnVolumeMutationVariables,
} from "gql/generated/types";
import { SPAWN_VOLUME } from "gql/mutations/spawn-volume";
import { AvailabilityZoneSelector } from "./spawnVolumeModal/AvailabilityZoneSelector";
import { reducer, initialState } from "./spawnVolumeModal/reducer";
import { SizeSelector } from "./spawnVolumeModal/SizeSelector";
import { TypeSelector } from "./spawnVolumeModal/TypeSelector";

interface SpawnVolumeModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const SpawnVolumeModal: React.FC<SpawnVolumeModalProps> = ({
  visible,
  onCancel,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchBanner = useBannerDispatchContext();
  const [spawnVolumeMutation, { loading: loadingSpawnVolume }] = useMutation<
    SpawnVolumeMutation,
    SpawnVolumeMutationVariables
  >(SPAWN_VOLUME, {
    onCompleted() {
      onCancel();
      dispatchBanner.successBanner("Successfully spawned volume");
    },
    onError(err) {
      onCancel();
      dispatchBanner.errorBanner(
        `There was an error while spawning your volume: ${err.message}`
      );
    },
    refetchQueries: ["myVolumes"],
  });

  const spawnVolume = () => {
    const mutationVars = { ...state };
    if (mutationVars.noExpiration === true) {
      delete mutationVars.expiration;
    }
    if (mutationVars.host === "") {
      delete mutationVars.host;
    }
    spawnVolumeMutation({ variables: { SpawnVolumeInput: mutationVars } });
  };

  return (
    <Modal
      title="Spawn New Volume"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <WideButton onClick={onCancel} key="cancel-button">
          Cancel
        </WideButton>,
        <WideButton
          data-cy="spawn-volume-button"
          disabled={loadingSpawnVolume}
          key="spawn-volume-button"
          onClick={spawnVolume}
          variant={Variant.Primary}
        >
          {loadingSpawnVolume ? "Spawning Volume" : "Spawn"}
        </WideButton>,
      ]}
      data-cy="spawn-volume-modal"
    >
      <Subtitle>Required Volume Information</Subtitle>
      <SizeSelector
        onChange={(s) => dispatch({ type: "setSize", data: s })}
        value={state.size}
      />
      <AvailabilityZoneSelector
        onChange={(z) => dispatch({ type: "setAvailabilityZone", data: z })}
        value={state.availabilityZone}
      />
      <TypeSelector
        onChange={(t) => dispatch({ type: "setType", typeId: t })}
        value={state.type}
      />
      <HR />
      <Subtitle>Optional Volume Information</Subtitle>
      <ExpirationField
        data={{
          expiration: state.expiration,
          noExpiration: state.noExpiration,
        }}
        onChange={(expData) => dispatch({ type: "editExpiration", ...expData })}
      />
      <SectionContainer>
        <SectionLabel weight="medium">Mount to Host</SectionLabel>
        <MountVolumeSelect
          label="Host"
          onChange={(hostId) => dispatch({ type: "setHost", hostId })}
          selectedHostId={state.host}
          targetAvailabilityZone={state.availabilityZone}
        />
      </SectionContainer>
    </Modal>
  );
};
