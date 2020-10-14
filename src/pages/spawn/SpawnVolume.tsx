import React from "react";
import { useQuery } from "@apollo/client";
import { Variant } from "@leafygreen-ui/badge";
import {
  Title,
  BadgeWrapper,
  TitleContainer,
  StyledBadge,
} from "components/Spawn";
import { MyVolumesQuery, MyVolumesQueryVariables } from "gql/generated/types";
import { GET_MY_VOLUMES } from "gql/queries";
import { SpawnVolumeTable } from "pages/spawn/spawnVolume/SpawnVolumeTable";
import { SpawnVolumeButton } from "./spawnVolume/SpawnVolumeButton";

export const SpawnVolume = () => {
  const { data: volumesData } = useQuery<
    MyVolumesQuery,
    MyVolumesQueryVariables
  >(GET_MY_VOLUMES);

  const mountedCount =
    volumesData?.myVolumes.filter((v) => v.hostID).length ?? 0;
  const unmountedCount =
    volumesData?.myVolumes.filter((v) => !v.hostID).length ?? 0;
  const volumes = volumesData?.myVolumes;

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
      <SpawnVolumeTable volumes={volumes} />
    </>
  );
};
