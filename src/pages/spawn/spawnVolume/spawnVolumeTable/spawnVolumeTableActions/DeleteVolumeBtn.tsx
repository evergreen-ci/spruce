import React from "react";
import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import Icon from "components/icons/Icon";
import { Popconfirm } from "components/Popconfirm";
import { useBannerDispatchContext } from "context/banners";
import {
  MyVolumesQuery,
  RemoveVolumeMutation,
  RemoveVolumeMutationVariables,
} from "gql/generated/types";
import { REMOVE_VOLUME } from "gql/mutations";

type Volume = MyVolumesQuery["myVolumes"][0];
interface Props {
  volume: Volume;
}

export const DeleteVolumeBtn: React.FC<Props> = ({ volume }) => {
  const dispatchBanner = useBannerDispatchContext();

  const [removeVolume, { loading: loadingRemoveVolume }] = useMutation<
    RemoveVolumeMutation,
    RemoveVolumeMutationVariables
  >(REMOVE_VOLUME, {
    refetchQueries: ["myVolumes"],
    onError: (err) =>
      dispatchBanner.errorBanner(`Error removing volume: '${err.message}'`),
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
        size="small"
        data-cy={`trash-${volume.displayName || volume.id}`}
        glyph={<Icon glyph="Trash" />}
        disabled={loadingRemoveVolume}
      />
    </Popconfirm>
  );
};
