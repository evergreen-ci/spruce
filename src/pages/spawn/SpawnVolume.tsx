import React from "react";
import { useQuery } from "@apollo/client";
import { Variant } from "@leafygreen-ui/badge";
import {
  Container,
  Title,
  BadgeWrapper,
  TitleContainer,
  StyledBadge,
} from "components/Spawn";
import { MyVolumesQuery, MyHostsQueryVariables } from "gql/generated/types";
import { GET_MY_VOLUMES } from "gql/queries";
import { SpawnVolumeButton } from "./spawnVolume/SpawnVolumeButton";

export const SpawnVolume = () => {
  const { data: volumesData } = useQuery<MyVolumesQuery, MyHostsQueryVariables>(
    GET_MY_VOLUMES
  );

  const mountedCount =
    volumesData?.myVolumes.filter((v) => v.hostID).length ?? 0;
  const unmountedCount =
    volumesData?.myVolumes.filter((v) => !v.hostID).length ?? 0;

  return (
    <Container>
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
      <SpawnVolumeButton showMetadata />
    </Container>
  );
};
