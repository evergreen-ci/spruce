import React, { useReducer, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Variant } from "@leafygreen-ui/button";
import { Subtitle } from "@leafygreen-ui/typography";
import { useSpawnAnalytics } from "analytics";
import { Modal } from "components/Modal";
import {
  MountVolumeSelect,
  SectionContainer,
  SectionLabel,
  WideButton,
} from "components/Spawn";
import { ExpirationField } from "components/Spawn/ExpirationField";
import { HR } from "components/styles/Layout";
import { useToastContext } from "context/toast";
import {
  SpawnVolumeMutation,
  SpawnVolumeMutationVariables,
  GetSpruceConfigQuery,
  MyVolumesQuery,
  MyVolumesQueryVariables,
} from "gql/generated/types";
import { SPAWN_VOLUME } from "gql/mutations/spawn-volume";
import { GET_SPRUCE_CONFIG, GET_MY_VOLUMES } from "gql/queries";
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
  const spawnAnalytics = useSpawnAnalytics();
  const dispatchToast = useToastContext();
  const { data: spruceConfig } = useQuery<GetSpruceConfigQuery>(
    GET_SPRUCE_CONFIG
  );
  const { data: volumesData } = useQuery<
    MyVolumesQuery,
    MyVolumesQueryVariables
  >(GET_MY_VOLUMES);

  const [spawnVolumeMutation, { loading: loadingSpawnVolume }] = useMutation<
    SpawnVolumeMutation,
    SpawnVolumeMutationVariables
  >(SPAWN_VOLUME, {
    onCompleted() {
      onCancel();

      dispatchToast.success("Successfully spawned volume");
    },
    onError(err) {
      onCancel();
      dispatchToast.error(
        `There was an error while spawning your volume: ${err.message}`
      );
    },
    refetchQueries: ["MyVolumes"],
  });

  useEffect(() => {
    if (visible) {
      dispatch({ type: "reset" });
    }
  }, [visible, dispatch]);

  const spawnVolume = () => {
    const mutationVars = { ...state };
    if (mutationVars.noExpiration === true) {
      delete mutationVars.expiration;
    }
    if (mutationVars.host === "") {
      delete mutationVars.host;
    }
    const variables = { SpawnVolumeInput: mutationVars };
    spawnAnalytics.sendEvent({ name: "Spawned a volume", params: variables });
    spawnVolumeMutation({ variables });
  };
  const volumeLimit =
    spruceConfig?.spruceConfig?.providers?.aws?.maxVolumeSizePerUser;
  const totalVolumeSize = volumesData?.myVolumes?.reduce(
    (cnt, v) => cnt + v.size,
    0
  );
  const maxSpawnableLimit =
    volumeLimit - totalVolumeSize >= 0 ? volumeLimit - totalVolumeSize : 0;

  useEffect(() => {
    // Update the size input when we set a new max volume size limit
    // If the max size limit is > 500 default to 500
    dispatch({
      type: "setSize",
      data: maxSpawnableLimit > 500 ? 500 : maxSpawnableLimit,
    });
  }, [maxSpawnableLimit, totalVolumeSize, volumeLimit]);

  return (
    <Modal
      title="Spawn New Volume"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <WideButton // @ts-expect-error
          onClick={onCancel}
          data-cy="cancel-button"
          key="cancel-button"
        >
          Cancel
        </WideButton>,
        <WideButton
          data-cy="spawn-volume-button"
          disabled={loadingSpawnVolume || state.size === 0}
          key="spawn-volume-button" // @ts-expect-error
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
        limit={maxSpawnableLimit}
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
        isVolume
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
