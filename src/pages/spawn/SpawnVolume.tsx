import React from "react";
import { useQuery } from "@apollo/client";
import { Variant } from "@leafygreen-ui/badge";
import { Subtitle } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import {
  Title,
  BadgeWrapper,
  TitleContainer,
  StyledBadge,
} from "components/Spawn";
import { pollInterval } from "constants/index";
import { useBannerDispatchContext } from "context/banners";
import { MyVolumesQuery, MyVolumesQueryVariables } from "gql/generated/types";
import { GET_MY_VOLUMES } from "gql/queries";
import { useNetworkStatus, usePageTitle } from "hooks";
import { SpawnVolumeTable } from "pages/spawn/spawnVolume/SpawnVolumeTable";
import { SpawnVolumeButton } from "./spawnVolume/SpawnVolumeButton";

export const SpawnVolume = () => {
  const { errorBanner } = useBannerDispatchContext();
  const { data: volumesData, loading, startPolling, stopPolling } = useQuery<
    MyVolumesQuery,
    MyVolumesQueryVariables
  >(GET_MY_VOLUMES, {
    pollInterval,
    onError: (e) => {
      errorBanner(`There was an error loading your spawn volume: ${e.message}`);
    },
  });
  useNetworkStatus(startPolling, stopPolling);
  usePageTitle("My Volumes");

  if (loading) {
    return <Skeleton />;
  }

  const mountedCount =
    volumesData?.myVolumes.filter((v) => v.hostID).length ?? 0;
  const unmountedCount =
    volumesData?.myVolumes.filter((v) => !v.hostID).length ?? 0;
  const volumes = volumesData?.myVolumes || [];
  return (
    <>
      <TitleContainer>
        <Title>Volumes</Title>
        <BadgeWrapper>
          <StyledBadge
            data-cy="mounted-badge"
            variant={Variant.Green}
          >{`${mountedCount} Mounted`}</StyledBadge>
          <StyledBadge
            data-cy="free-badge"
            variant={Variant.Blue}
          >{`${unmountedCount} Free`}</StyledBadge>
        </BadgeWrapper>
      </TitleContainer>
      <SpawnVolumeButton />
      {volumes.length ? (
        <SpawnVolumeTable volumes={volumes} />
      ) : (
        <Subtitle>
          No Spawned volumes available, Spawn one to get started
        </Subtitle>
      )}
    </>
  );
};
