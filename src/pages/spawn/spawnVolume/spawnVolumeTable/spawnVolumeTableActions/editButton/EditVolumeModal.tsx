import React, { useEffect, useReducer } from "react";
import { useMutation } from "@apollo/client";
import { Variant } from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import { useSpawnAnalytics } from "analytics";
import { Modal } from "components/Modal";
import {
  ExpirationField,
  ModalContent,
  SectionContainer,
  SectionLabel,
  WideButton,
} from "components/Spawn";
import { useToastContext } from "context/toast";
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

export const EditVolumeModal: React.VFC<Props> = ({
  visible,
  onCancel,
  volume,
}) => {
  const [state, dispatch] = useReducer(reducer, getInitialState(volume));
  const dispatchToast = useToastContext();
  const spawnAnalytics = useSpawnAnalytics();
  const [updateVolumeMutation, { loading }] = useMutation<
    UpdateVolumeMutation,
    UpdateVolumeMutationVariables
  >(UPDATE_SPAWN_VOLUME, {
    onCompleted() {
      onCancel();
      dispatchToast.success("Successfully updated volume");
    },
    onError(err) {
      onCancel();

      dispatchToast.error(
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
          data-cy="cancel-volume-button" // @ts-expect-error
          onClick={onCancel}
          key="cancel-button"
        >
          Cancel
        </WideButton>,
        <WideButton
          data-cy="update-volume-button"
          disabled={loading || noChange}
          key="update-volume-button" // @ts-expect-error
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
          <TextInput
            label="Volume Name"
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
