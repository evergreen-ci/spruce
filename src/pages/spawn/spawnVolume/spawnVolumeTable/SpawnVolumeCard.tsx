import React from "react";
import { DoesNotExpire, DetailsCard } from "components/Spawn";
import { MyVolume } from "types/spawn";
import { string } from "utils";

const { getDateCopy } = string;
interface Props {
  volume: MyVolume;
}

export const SpawnVolumeCard: React.FC<Props> = ({ volume }) => (
  <DetailsCard
    data-cy={`spawn-volume-card-${volume.displayName || volume.id}`}
    fieldMaps={spawnVolumeCardFields}
    type={volume}
  />
);

const spawnVolumeCardFields = {
  "Created at": (volume: MyVolume) => <>{getDateCopy(volume.creationTime)}</>,
  "Expires at": (volume: MyVolume) => (
    <>
      {volume.noExpiration || !volume.expiration || volume.host
        ? DoesNotExpire
        : getDateCopy(volume.expiration)}
    </>
  ),
  Type: (volume: MyVolume) => <>{volume.type}</>,
  Size: (volume: MyVolume) => <>{volume.size} GB</>,
  "Availability Zone": (volume: MyVolume) => <>{volume.availabilityZone}</>,
  "Is Home Volume": (volume: MyVolume) => (
    <>{volume.homeVolume ? "True" : "False"}</>
  ),
};
