import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Button, { Size } from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { useSpawnAnalytics } from "analytics/spawn/useSpawnAnalytics";
import Icon from "components/icons/Icon";
import { Popconfirm } from "components/Popconfirm";
import { useBannerDispatchContext } from "context/banners";
import {
  RemoveVolumeMutation,
  RemoveVolumeMutationVariables,
} from "gql/generated/types";
import { REMOVE_VOLUME } from "gql/mutations";
import { MyVolume } from "types/spawn";

interface Props {
  volume: MyVolume;
}

export const DeleteVolumeBtn: React.FC<Props> = ({ volume }) => {
  const dispatchBanner = useBannerDispatchContext();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [removeVolume, { loading: loadingRemoveVolume }] = useMutation<
    RemoveVolumeMutation,
    RemoveVolumeMutationVariables
  >(REMOVE_VOLUME, {
    refetchQueries: ["MyVolumes", "MyHosts"],
    onError: (err) =>
      dispatchBanner.errorBanner(`Error removing volume: '${err.message}'`),
    onCompleted: () => {
      dispatchBanner.successBanner("Successfully deleted the volume.");
    },
  });

  const volumeName = volume.displayName ? volume.displayName : volume.id;
  const spawnAnalytics = useSpawnAnalytics();
  return (
    <Popconfirm
      icon={null}
      placement="left"
      title={
        <>
          {`Delete this volume ${volumeName}?`}
          {volume.hostID && (
            <div style={{ paddingTop: 8 }}>
              <Checkbox
                className="cy-checkbox"
                onChange={() => setConfirmDelete(!confirmDelete)}
                label="I understand this volume is currently mounted to a host."
                checked={confirmDelete}
                bold={false}
              />
            </div>
          )}
        </>
      }
      onConfirm={() => {
        spawnAnalytics.sendEvent({
          name: "Delete volume",
          volumeId: volume.id,
        });
        removeVolume({ variables: { volumeId: volume.id } });
      }}
      okText="Yes"
      okButtonProps={{ disabled: !confirmDelete && volume.hostID.length > 0 }}
      cancelText="Cancel"
    >
      <Button
        size={Size.XSmall}
        data-cy={`trash-${volume.displayName || volume.id}`}
        glyph={<Icon glyph="Trash" />}
        disabled={loadingRemoveVolume}
      />
    </Popconfirm>
  );
};
