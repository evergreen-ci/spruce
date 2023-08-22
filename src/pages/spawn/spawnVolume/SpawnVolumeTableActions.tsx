import styled from "@emotion/styled";
import { size } from "constants/tokens";
import { TableVolume } from "types/spawn";
import { DeleteVolumeButton } from "./spawnVolumeTableActions/DeleteVolumeButton";
import { EditButton } from "./spawnVolumeTableActions/EditButton";
import { MigrateButton } from "./spawnVolumeTableActions/MigrateButton";
import { MountButton } from "./spawnVolumeTableActions/MountButton";
import { UnmountButton } from "./spawnVolumeTableActions/UnmountButton";

interface Props {
  volume: TableVolume;
}

export const SpawnVolumeTableActions: React.FC<Props> = ({ volume }) => {
  const { displayName, homeVolume, host, id } = volume;
  return (
    <FlexRow
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <DeleteVolumeButton
        data-cy={`trash-${displayName || id}`}
        volume={volume}
      />
      {homeVolume && <MigrateButton volume={volume} />}
      {host && !homeVolume && (
        <UnmountButton
          data-cy={`unmount-${displayName || id}`}
          volume={volume}
        />
      )}
      {!host && !homeVolume && (
        <MountButton data-cy={`mount-${displayName || id}`} volume={volume} />
      )}
      <EditButton data-cy={`edit-${displayName || id}`} volume={volume} />
    </FlexRow>
  );
};

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;
  gap: ${size.xs};
`;
