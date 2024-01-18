import { useState } from "react";
import { useMutation } from "@apollo/client";
import Button, { Size } from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { useSpawnAnalytics } from "analytics/spawn/useSpawnAnalytics";
import Icon from "components/Icon";
import Popconfirm from "components/Popconfirm";
import { useToastContext } from "context/toast";
import {
  RemoveVolumeMutation,
  RemoveVolumeMutationVariables,
} from "gql/generated/types";
import { REMOVE_VOLUME } from "gql/mutations";
import { TableVolume } from "types/spawn";

interface Props {
  volume: TableVolume;
}

export const DeleteVolumeButton: React.FC<Props> = ({ volume }) => {
  const dispatchToast = useToastContext();
  const [removeVolume, { loading: loadingRemoveVolume }] = useMutation<
    RemoveVolumeMutation,
    RemoveVolumeMutationVariables
  >(REMOVE_VOLUME, {
    refetchQueries: ["MyVolumes", "MyHosts"],
    onError: (err) =>
      dispatchToast.error(`Error removing volume: '${err.message}'`),
    onCompleted: () => {
      dispatchToast.success("Successfully deleted the volume.");
    },
  });

  const volumeName = volume.displayName ? volume.displayName : volume.id;
  const spawnAnalytics = useSpawnAnalytics();

  const [checkboxAcknowledged, setCheckboxAcknowledged] = useState(
    !volume.hostID,
  );

  return (
    <Popconfirm
      confirmDisabled={!checkboxAcknowledged}
      data-cy="delete-volume-popconfirm"
      onConfirm={() => {
        spawnAnalytics.sendEvent({
          name: "Delete volume",
          volumeId: volume.id,
        });
        removeVolume({ variables: { volumeId: volume.id } });
      }}
      trigger={
        <Button
          size={Size.XSmall}
          data-cy={`trash-${volume.displayName || volume.id}`}
          disabled={loadingRemoveVolume || volume.migrating}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Icon glyph="Trash" />
        </Button>
      }
    >
      Delete volume “{volumeName}”?
      {volume.hostID && (
        <Checkbox
          data-cy="abort-checkbox"
          label="I understand this volume is currently mounted to a host."
          onChange={(e) => {
            e.nativeEvent.stopPropagation();
            setCheckboxAcknowledged(!checkboxAcknowledged);
          }}
          checked={checkboxAcknowledged}
        />
      )}
    </Popconfirm>
  );
};
