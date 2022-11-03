import styled from "@emotion/styled";
import { size } from "constants/tokens";
import { MyVolume } from "types/spawn";
import { DeleteVolumeBtn } from "./spawnVolumeTableActions/DeleteVolumeBtn";
import { EditButton } from "./spawnVolumeTableActions/EditButton";
import { MigrateBtn } from "./spawnVolumeTableActions/MigrateBtn";
import { MountBtn } from "./spawnVolumeTableActions/MountBtn";
import { UnmountBtn } from "./spawnVolumeTableActions/UnmountBtn";

interface Props {
  volume: MyVolume;
}

export const SpawnVolumeTableActions: React.VFC<Props> = ({ volume }) => {
  const { homeVolume, host, id, displayName } = volume;
  return (
    <FlexRow
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <DeleteVolumeBtn data-cy={`trash-${displayName || id}`} volume={volume} />
      {homeVolume && <MigrateBtn volume={volume} />}
      {host && !homeVolume && (
        <UnmountBtn data-cy={`unmount-${displayName || id}`} volume={volume} />
      )}
      {!host && !homeVolume && (
        <MountBtn data-cy={`mount-${displayName || id}`} volume={volume} />
      )}
      <EditButton data-cy={`edit-${displayName || id}`} volume={volume} />
    </FlexRow>
  );
};

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;
  button {
    margin-right: ${size.xs};
  }
`;
