import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import Button, { Size } from "@leafygreen-ui/button";
import { Tooltip } from "antd";
import { useSpawnAnalytics } from "analytics/spawn/useSpawnAnalytics";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { Popconfirm } from "components/Popconfirm";
import { useBannerDispatchContext } from "context/banners";
import {
  MyHostsQuery,
  MyHostsQueryVariables,
  DetachVolumeFromHostMutation,
  DetachVolumeFromHostMutationVariables,
} from "gql/generated/types";
import { DETACH_VOLUME } from "gql/mutations";
import { GET_MY_HOSTS } from "gql/queries";
import { MyVolume } from "types/spawn";

interface Props {
  volume: MyVolume;
}

export const UnmountBtn: React.FC<Props> = ({ volume }) => {
  const dispatchBanner = useBannerDispatchContext();
  const spawnAnalytics = useSpawnAnalytics();

  const { data: myHostsData } = useQuery<MyHostsQuery, MyHostsQueryVariables>(
    GET_MY_HOSTS
  );

  const { myHosts } = myHostsData;
  const [detachVolume, { loading: loadingDetachVolume }] = useMutation<
    DetachVolumeFromHostMutation,
    DetachVolumeFromHostMutationVariables
  >(DETACH_VOLUME, {
    onError: (err) =>
      dispatchBanner.errorBanner(`Error detaching volume: '${err.message}'`),
    onCompleted: () => {
      dispatchBanner.successBanner("Successfully unmounted the volume.");
    },
    refetchQueries: ["MyVolumes", "MyHosts"],
  });

  const volumeName = volume.displayName ? volume.displayName : volume.id;
  const hostName = volume.host?.displayName
    ? volume.host.displayName
    : volume.host?.id;
  // Check if myHosts has this volume as one of its homeVolumes. This handles the scenarios where
  // one of the volumes was a home volume but is no longer attached to a host
  const isHomeVolume = myHosts.some((h) => h.homeVolumeID === volume.id);
  return (
    <ConditionalWrapper
      condition={isHomeVolume}
      wrapper={(children) => (
        <Tooltip title="Cannot unmount home volume">
          <span>{children}</span>
        </Tooltip>
      )}
      altWrapper={(children) => (
        <Popconfirm
          icon={null}
          placement="left"
          title={`Detach this volume ${volumeName} from host ${hostName}?`}
          onConfirm={() => {
            spawnAnalytics.sendEvent({
              name: "Unmount volume",
              volumeId: volume.id,
            });
            detachVolume({ variables: { volumeId: volume.id } });
          }}
          okText="Yes"
          cancelText="Cancel"
          disabled={volume.homeVolume}
        >
          {children}
        </Popconfirm>
      )}
    >
      <Button
        size={Size.XSmall}
        data-cy={`detach-btn-${volume.displayName || volume.id}`}
        disabled={loadingDetachVolume || volume.homeVolume}
      >
        Unmount
      </Button>
    </ConditionalWrapper>
  );
};
