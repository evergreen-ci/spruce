import React from "react";
import styled from "@emotion/styled";
import { MyVolume } from "types/spawn";
import { DeleteVolumeBtn } from "./spawnVolumeTableActions/DeleteVolumeBtn";
import { EditButton } from "./spawnVolumeTableActions/EditButton";
import { MountBtn } from "./spawnVolumeTableActions/MountBtn";
import { UnmountBtn } from "./spawnVolumeTableActions/UnmountBtn";

interface Props {
  volume: MyVolume;
}

export const SpawnVolumeTableActions: React.FC<Props> = ({ volume }) => (
  <FlexRow>
    <DeleteVolumeBtn
      data-cy={`trash-${volume.displayName || volume.id}`}
      volume={volume}
    />
    {volume.host ? (
      <UnmountBtn
        data-cy={`unmount-${volume.displayName || volume.id}`}
        volume={volume}
      />
    ) : (
      <MountBtn
        data-cy={`mount-${volume.displayName || volume.id}`}
        volume={volume}
      />
    )}
    <EditButton
      data-cy={`edit-${volume.displayName || volume.id}`}
      volume={volume}
    />
  </FlexRow>
);

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;
  button {
    margin-right: 8px;
  }
`;
