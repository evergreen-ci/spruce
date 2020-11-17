import React, { useEffect, useReducer } from "react";
import { useMutation } from "@apollo/client";
import { Variant } from "@leafygreen-ui/button";
import { Input } from "antd";
import { useSpawnAnalytics } from "analytics";
import { Modal } from "components/Modal";
import {
  ExpirationField,
  ModalContent,
  SectionContainer,
  SectionLabel,
  WideButton,
} from "components/Spawn";
import { InputLabel } from "components/styles";
import { useBannerDispatchContext } from "context/banners";
import {
  UpdateVolumeMutation,
  UpdateVolumeMutationVariables,
} from "gql/generated/types";
import { UPDATE_SPAWN_VOLUME } from "gql/mutations";
import { MyVolume } from "types/spawn";
import { getInitialState, reducer } from "./editVolumeModal/reducer";

interface Props {
  visible: boolean;
  onCancel: () => void;
  volume: MyVolume;
}

export const EditVolumeModal: React.FC<Props> = ({
  visible,
  onCancel,
  volume,
}) => {
  const [state, dispatch] = useReducer(reducer, getInitialState(volume));
  const dispatchBanner = useBannerDispatchContext();
  const spawnAnalytics = useSpawnAnalytics();
  const [updateVolumeMutation, { loading }] = useMutation<
    UpdateVolumeMutation,
    UpdateVolumeMutationVariables
  >(UPDATE_SPAWN_VOLUME, {
    onCompleted() {
      onCancel();
      dispatchBanner.successBanner("Successfully updated volume");
    },
    onError(err) {
      onCancel();
      dispatchBanner.clearAllBanners();
      dispatchBanner.errorBanner(
        `There was an error while updating your volume: ${err.message}`
      );
    },
    refetchQueries: ["MyVolumes", "MyHosts"],
  });

  useEffect(() => {
    if (visible) {
      dispatch({ type: "reset", volume: getInitialState(volume) });
    }
  }, [visible, volume]);

  const updateVolume = () => {
    const mutationVars = { ...state };
    if (mutationVars.name === volume.displayName) {
      delete mutationVars.name;
    }
    if (mutationVars.noExpiration === true) {
      delete mutationVars.expiration;
    }
    const variables = { UpdateVolumeInput: mutationVars };
    spawnAnalytics.sendEvent({
      name: "Edited a Spawn Volume",
      params: variables,
    });
    updateVolumeMutation({
      variables,
    });
  };

  const noChange =
    state.name === volume.displayName &&
    new Date(state.expiration).getTime() ===
      new Date(volume.expiration).getTime() &&
    state.noExpiration === volume.noExpiration;

  return (
    <Modal
      title="Edit Volume"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <WideButton
          data-cy="cancel-volume-button"
          onClick={onCancel}
          key="cancel-button"
        >
          Cancel
        </WideButton>,
        <WideButton
          data-cy="update-volume-button"
          disabled={loading || noChange}
          key="update-volume-button"
          onClick={updateVolume}
          variant={Variant.Primary}
        >
          {loading ? "Saving" : "Save"}
        </WideButton>,
      ]}
      data-cy="update-volume-modal"
    >
      <SectionContainer>
        <SectionLabel weight="medium">Volume name</SectionLabel>
        <ModalContent>
          <InputLabel htmlFor="hostNameInput">Volume Name</InputLabel>
          <Input
            data-cy="volume-name-input"
            id="volumeNameInput"
            value={state.name}
            onChange={(e) =>
              dispatch({ type: "setDisplayName", name: e.target.value })
            }
          />
        </ModalContent>
      </SectionContainer>
      <ExpirationField
        isVolume
        targetItem={volume}
        data={{
          expiration: state.expiration,
          noExpiration: state.noExpiration,
        }}
        onChange={(expData) => dispatch({ type: "editExpiration", ...expData })}
      />
    </Modal>
  );
};
