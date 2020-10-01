import React from "react";
import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import { Popconfirm } from "components/Popconfirm";
import { useBannerDispatchContext } from "context/banners";
import { DETACH_VOLUME } from "gql/mutations";
import { MyVolume } from "types/spawn";

interface Props {
  volume: MyVolume;
}

export const UnmountBtn: React.FC<Props> = ({ volume }) => {
  const dispatchBanner = useBannerDispatchContext();

  const [detachVolume, { loading: loadingDetachVolume }] = useMutation(
    DETACH_VOLUME,
    {
      onError: (err) =>
        dispatchBanner.errorBanner(`Error detaching volume: '${err.message}'`),
      onCompleted: () => {
        dispatchBanner.successBanner("Successfully unmounted the volume.");
      },
      refetchQueries: ["myVolumes", "myHosts"],
    }
  );

  const volumeName = volume.displayName ? volume.displayName : volume.id;
  const hostName = volume.host?.displayName
    ? volume.host.displayName
    : volume.host?.id;

  return (
    <Popconfirm
      icon={null}
      placement="left"
      title={`Detach this volume ${volumeName} from host ${hostName}?`}
      onConfirm={() => {
        detachVolume({ variables: { volumeId: volume.id } });
      }}
      okText="Yes"
      cancelText="Cancel"
    >
      <Button
        size="small"
        data-cy={`detach-btn-${volume.displayName || volume.id}`}
        disabled={loadingDetachVolume}
      >
        Unmount
      </Button>
    </Popconfirm>
  );
};
