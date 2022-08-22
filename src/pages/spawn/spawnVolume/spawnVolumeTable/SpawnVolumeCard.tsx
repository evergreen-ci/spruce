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
}) => {
  const tz = useUserTimeZone();
  return (
    <span>
      {noExpiration || !expiration
        ? DoesNotExpire
        : getDateCopy(expiration, { tz })}
    </span>
  );
};

const spawnVolumeCardFields = {
  "Created at": VolumeCreationTime,
  "Expires at": VolumeExpiration,
  Type: (volume: MyVolume) => <span>{volume.type}</span>,
  Size: (volume: MyVolume) => <span>{volume.size} GB</span>,
  "Availability Zone": (volume: MyVolume) => (
    <span>{volume.availabilityZone}</span>
  ),
  "Is Home Volume": (volume: MyVolume) => (
    <span>{volume.homeVolume ? "True" : "False"}</span>
  ),
};
