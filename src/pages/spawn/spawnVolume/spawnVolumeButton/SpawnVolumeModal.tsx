import React, { useReducer } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Variant } from "@leafygreen-ui/button";
import { Subtitle } from "@leafygreen-ui/typography";
import { InputNumber } from "antd";
import Icon from "components/icons/Icon";
import { Modal } from "components/Modal";
import { RegionSelector, Section, WideButton } from "components/Spawn";
import { ExpirationField } from "components/Spawn/ExpirationField";
import { InputLabel } from "components/styles";
import { useBannerDispatchContext } from "context/banners";
import {
  AwsRegionsQuery,
  AwsRegionsQueryVariables,
  SpawnVolumeMutation,
  SpawnVolumeMutationVariables,
} from "gql/generated/types";
import { SPAWN_VOLUME } from "gql/mutations/spawn-volume";
import { GET_AWS_REGIONS } from "gql/queries";

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

type Action =
  | { type: "setSize"; data: number }
  | { type: "setAvailabilityZone"; data: string }
  | { type: "editExpiration"; expiration?: Date; noExpiration?: boolean }
  | { type: "setHost"; hostId: string };

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
  const { data: awsData } = useQuery<AwsRegionsQuery, AwsRegionsQueryVariables>(
    GET_AWS_REGIONS
  );

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
        <Subtitle>Required Volume Information</Subtitle>
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
        <RegionSelector
          onChange={(value) =>
            dispatch({ type: "setAvailabilityZone", data: value })
          }
          selectedRegion={state.availabilityZone}
          awsRegions={awsData?.awsRegions}
        />
        <ExpirationField
          data={{
            expiration: state.expiration,
            noExpiration: state.noExpiration,
          }}
          onChange={(expData) =>
            dispatch({ type: "editExpiration", ...expData })
          }
        />
      </div>
    </Modal>
  );
};
