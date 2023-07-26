import { DoesNotExpire, DetailsCard } from "components/Spawn";
import { useDateFormat } from "hooks";
import { TableVolume } from "types/spawn";

interface Props {
  volume: TableVolume;
}

export const SpawnVolumeCard: React.VFC<Props> = ({ volume }) => (
  <DetailsCard
    data-cy={`spawn-volume-card-${volume.displayName || volume.id}`}
    fieldMaps={spawnVolumeCardFields}
    type={volume}
  />
);

const VolumeCreationTime: React.VFC<TableVolume> = ({ creationTime }) => {
  const getDateCopy = useDateFormat();
  return <>{getDateCopy(creationTime)}</>;
};

const VolumeExpiration: React.VFC<TableVolume> = ({
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
  "Availability Zone": (volume: TableVolume) => (
    <span>{volume.availabilityZone}</span>
  ),
  "Created at": VolumeCreationTime,
  "Expires at": VolumeExpiration,
  "Is Home Volume": (volume: TableVolume) => (
    <span>{volume.homeVolume ? "True" : "False"}</span>
  ),
  Size: (volume: TableVolume) => <span>{volume.size} GB</span>,
  Type: (volume: TableVolume) => <span>{volume.type}</span>,
};
