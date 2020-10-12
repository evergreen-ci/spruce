import React, { useReducer } from "react";
import { useMutation } from "@apollo/client";
import { Variant } from "@leafygreen-ui/button";
import { Subtitle } from "@leafygreen-ui/typography";
import { InputNumber } from "antd";
import Icon from "components/icons/Icon";
import { Modal } from "components/Modal";
import { Section, WideButton } from "components/Spawn";
import { InputLabel } from "components/styles";
import { useBannerDispatchContext } from "context/banners";
import {
  SpawnVolumeMutation,
  SpawnVolumeMutationVariables,
} from "gql/generated/types";
import { SPAWN_VOLUME } from "gql/mutations/spawn-volume";

interface SpawnVolumeModalProps {
  visible: boolean;
  onCancel: () => void;
}
const initialState: SpawnVolumeMutationVariables["SpawnVolumeInput"] = {
  availabilityZone: "",
  size: 500,
  type: "",
  expiration: null,
  noExpiration: false,
  host: "",
};

function reducer(
  state: SpawnVolumeMutationVariables["SpawnVolumeInput"],
  action
) {
  switch (action.type) {
    case "setSize":
      return { ...state, size: action.data };
    default:
      return state;
  }
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
    refetchQueries: ["MyVolumes"],
  });
  const spawnVolume = () => {
    spawnVolumeMutation({ variables: { SpawnVolumeInput: state } });
  };
  const canSubmitSpawnVolume = true;

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
          disabled={!canSubmitSpawnVolume || loadingSpawnVolume}
          onClick={spawnVolume}
          variant={Variant.Primary}
          key="spawn-volume-button"
          glyph={loadingSpawnVolume && <Icon glyph="Refresh" />}
        >
          {loadingSpawnVolume ? "Spawning Volume" : "Spawn"}
        </WideButton>,
      ]}
      data-cy="spawn-volume-modal"
    >
      <div>
        <Subtitle> Required Volume Information</Subtitle>
        <Section>
          <InputLabel htmlFor="volumeSize">Size</InputLabel>
          <InputNumber
            min={1}
            max={500}
            value={state.size}
            onChange={(value) =>
              dispatch({ type: "setSize", data: value as number })
            }
          />
        </Section>
      </div>
    </Modal>
  );
};
