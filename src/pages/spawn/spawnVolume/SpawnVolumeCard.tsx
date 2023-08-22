import { DoesNotExpire, DetailsCard } from "components/Spawn";
import { useDateFormat } from "hooks";
import { TableVolume } from "types/spawn";

interface Props {
  volume: TableVolume;
}

export const SpawnVolumeCard: React.FC<Props> = ({ volume }) => (
  <DetailsCard
    data-cy={`spawn-volume-card-${volume.displayName || volume.id}`}
    fieldMaps={spawnVolumeCardFields}
    type={volume}
  />
);

const VolumeCreationTime: React.FC<TableVolume> = ({ creationTime }) => {
  const getDateCopy = useDateFormat();
  return <>{getDateCopy(creationTime)}</>;
};

const VolumeExpiration: React.FC<TableVolume> = ({
  expiration,
  noExpiration,
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
  Type: (volume: TableVolume) => <span>{volume.type}</span>,
  Size: (volume: TableVolume) => <span>{volume.size} GB</span>,
  "Availability Zone": (volume: TableVolume) => (
    <span>{volume.availabilityZone}</span>
  ),
  "Is Home Volume": (volume: TableVolume) => (
    <span>{volume.homeVolume ? "True" : "False"}</span>
  ),
};
