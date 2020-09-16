import React from "react";
import { MyVolumesQuery } from "gql/generated/types";
import { DeleteVolumeBtn } from "pages/spawn/spawnVolume/spawnVolumeTable/spawnVolumeTableActions/DeleteVolumeBtn";

type Volume = MyVolumesQuery["myVolumes"][0];
interface Props {
  volume: Volume;
}
export const SpawnVolumeTableActions: React.FC<Props> = ({ volume }) => (
  <div>
    <DeleteVolumeBtn volume={volume} />
  </div>
);
