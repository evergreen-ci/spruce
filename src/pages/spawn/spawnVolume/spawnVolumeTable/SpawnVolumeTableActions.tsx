import React from "react";
import styled from "@emotion/styled";
import { MyVolumesQuery } from "gql/generated/types";
import { DeleteVolumeBtn } from "pages/spawn/spawnVolume/spawnVolumeTable/spawnVolumeTableActions/DeleteVolumeBtn";
import { MountBtn } from "pages/spawn/spawnVolume/spawnVolumeTable/spawnVolumeTableActions/MountBtn";
import { UnmountBtn } from "pages/spawn/spawnVolume/spawnVolumeTable/spawnVolumeTableActions/UnmountBtn";

type Volume = MyVolumesQuery["myVolumes"][0];
interface Props {
  volume: Volume;
}

export const SpawnVolumeTableActions: React.FC<Props> = ({ volume }) => (
  <FlexRow>
    <DeleteVolumeBtn volume={volume} />
    {volume.host ? (
      <UnmountBtn volume={volume} />
    ) : (
      <MountBtn volume={volume} />
    )}
  </FlexRow>
);

const FlexRow = styled.div`
  display: flex;
  > span {
    margin-right: 8px;
  }
`;
