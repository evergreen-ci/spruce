import React from "react";
import { DoesNotExpire, DetailsCard } from "components/Spawn";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import { MyVolume } from "types/spawn";
import { string } from "utils";

const { getDateCopy } = string;
interface Props {
  volume: MyVolume;
}

export const SpawnVolumeCard: React.VFC<Props> = ({ volume }) => (
  <DetailsCard
    data-cy={`spawn-volume-card-${volume.displayName || volume.id}`}
    fieldMaps={spawnVolumeCardFields}
    type={volume}
  />
);

const VolumeCreationTime: React.VFC<MyVolume> = ({ creationTime }) => {
  const tz = useUserTimeZone();
  return <>{getDateCopy(creationTime, { tz })}</>;
};

const VolumeExpiration: React.VFC<MyVolume> = ({
  noExpiration,
  expiration,
  host,
}) => {
  const tz = useUserTimeZone();
  return (
    <>
      {noExpiration || !expiration || host
        ? DoesNotExpire
        : getDateCopy(expiration, { tz })}
    </>
  );
};
const spawnVolumeCardFields = {
  "Created at": VolumeCreationTime,
  "Expires at": VolumeExpiration,
  Type: (volume: MyVolume) => <>{volume.type}</>,
  Size: (volume: MyVolume) => <>{volume.size} GB</>,
  "Availability Zone": (volume: MyVolume) => <>{volume.availabilityZone}</>,
  "Is Home Volume": (volume: MyVolume) => (
    <>{volume.homeVolume ? "True" : "False"}</>
  ),
};
