import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { size } from "constants/tokens";
import { MyHostsQuery, MyHostsQueryVariables } from "gql/generated/types";
import { GET_MY_HOSTS } from "gql/queries";
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
  const { data: myHostsData } = useQuery<MyHostsQuery, MyHostsQueryVariables>(
    GET_MY_HOSTS
  );
  const myHosts = myHostsData?.myHosts ?? [];
  // Show the migrate button if the volume is a home volume and mounted to a virtual workstation
  const showMigrateBtn = !!myHosts?.find(
    (h) => h.homeVolumeID === volume.id && h.distro?.isVirtualWorkStation
  );
  return (
    <FlexRow>
      <DeleteVolumeBtn
        data-cy={`trash-${volume.displayName || volume.id}`}
        volume={volume}
      />
      {showMigrateBtn && <MigrateBtn volume={volume} />}
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
};

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;
  button {
    margin-right: ${size.xs};
  }
`;
