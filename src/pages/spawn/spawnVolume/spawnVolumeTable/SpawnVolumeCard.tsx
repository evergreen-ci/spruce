import { DoesNotExpire, DetailsCard } from "components/Spawn";
import { useDateFormat } from "hooks";
import { MyVolume } from "types/spawn";

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
  const getDateCopy = useDateFormat();
  return <>{getDateCopy(creationTime)}</>;
};

const VolumeExpiration: React.VFC<MyVolume> = ({
  noExpiration,
  expiration,
}) => {
  const getDateCopy = useDateFormat();
  return (
    <span>
      {noExpiration || !expiration ? DoesNotExpire : getDateCopy(expiration)}
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
