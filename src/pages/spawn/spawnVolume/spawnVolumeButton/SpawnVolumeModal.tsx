import React, { useReducer } from "react";
import { useMutation } from "@apollo/client";
import { Variant } from "@leafygreen-ui/button";
import { Subtitle } from "@leafygreen-ui/typography";
import Icon from "components/icons/Icon";
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
import { SizeSelector } from "./spawnVolumeModal/SizeSelector";
import { TypeSelector } from "./spawnVolumeModal/TypeSelector";

interface SpawnVolumeModalProps {
  visible: boolean;
  onCancel: () => void;
}

const initialState: SpawnVolumeMutationVariables["SpawnVolumeInput"] = {
  availabilityZone: "us-east-1a",
  size: 500,
  type: "gp2",
  expiration: null,
  noExpiration: false,
  host: "",
};

type Action =
  | { type: "setSize"; data: number }
  | { type: "setAvailabilityZone"; data: string }
  | { type: "editExpiration"; expiration?: Date; noExpiration?: boolean }
  | { type: "setHost"; hostId: string }
  | { type: "setType"; typeId: string };

function reducer(
  state: SpawnVolumeMutationVariables["SpawnVolumeInput"],
  action: Action
) {
  switch (action.type) {
    case "setSize":
      return { ...state, size: action.data };
    case "setAvailabilityZone":
      return { ...state, availabilityZone: action.data };
    case "editExpiration":
      return {
        ...state,
        expiration: action.expiration || state.expiration,
        noExpiration: action.noExpiration || state.noExpiration,
      };
    case "setType":
      return {
        ...state,
        type: action.typeId,
      };
    case "setHost":
      return {
        ...state,
        host: action.hostId,
      };
    default:
      throw new Error("Unknown action type");
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
      <Subtitle>Required Volume Information</Subtitle>
      <SizeSelector
        value={state.size}
        onChange={(s) => dispatch({ type: "setSize", data: s })}
      />
      <TypeSelector
        onChange={(t) => dispatch({ type: "setType", typeId: t })}
        value={state.type}
      />
      <HR />
      <Subtitle>Optional Volume Information</Subtitle>
      <SectionContainer>
        <SectionLabel weight="medium">Expiration</SectionLabel>
        <ExpirationField
          data={{
            expiration: state.expiration,
            noExpiration: state.noExpiration,
          }}
          onChange={(expData) =>
            dispatch({ type: "editExpiration", ...expData })
          }
        />
      </SectionContainer>
      <SectionContainer>
        <SectionLabel weight="medium">Mount to Host</SectionLabel>
        <MountVolumeSelect
          targetAvailabilityZone={state.availabilityZone}
          selectedHostId={state.host}
          onChange={(hostId) => dispatch({ type: "setHost", hostId })}
          label="Host"
        />
      </SectionContainer>
    </Modal>
  );
};
