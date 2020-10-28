import React from "react";
import { useMutation } from "@apollo/client";
import Button, { Size } from "@leafygreen-ui/button";
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

  const [removeVolume, { loading: loadingRemoveVolume }] = useMutation<
    RemoveVolumeMutation,
    RemoveVolumeMutationVariables
  >(REMOVE_VOLUME, {
    refetchQueries: ["myVolumes", "myHosts"],
    onError: (err) =>
      dispatchBanner.errorBanner(`Error removing volume: '${err.message}'`),
    onCompleted: () => {
      dispatchBanner.successBanner("Successfully deleted the volume.");
    },
  });

  const volumeName = volume.displayName ? volume.displayName : volume.id;

  return (
    <Popconfirm
      icon={null}
      placement="left"
      title={`Delete this volume ${volumeName}?`}
      onConfirm={() => {
        removeVolume({ variables: { volumeId: volume.id } });
      }}
      okText="Yes"
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
