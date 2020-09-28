import React from "react";
import { CardContainer, CardField, DoesNotExpire } from "components/Spawn";
import { MyVolume } from "types/spawn";
import { getDateCopy } from "utils/string";

interface Props {
  volume: MyVolume;
}

export const SpawnVolumeCard: React.FC<Props> = ({ volume }) => (
  <CardContainer
    data-cy={`spawn-volume-card-${volume.displayName || volume.id}`}
  >
    {spawnVolumeCardFields.map(({ label, Comp }) => (
      <CardField key={label} field={label} value={<Comp volume={volume} />} />
    ))}
  </CardContainer>
);

interface CardItem {
  label: string;
  Comp: React.FC<Props>;
}

const spawnVolumeCardFields: CardItem[] = [
  {
    label: "Created at",
    Comp: ({ volume }) => <>{getDateCopy(volume.creationTime)}</>,
  },
  {
    label: "Expires at",
    Comp: ({ volume }) => (
      <>
        {volume.noExpiration || !volume.expiration
          ? DoesNotExpire
          : getDateCopy(volume.expiration)}
      </>
    ),
  },
  { label: "Type", Comp: ({ volume }) => <>{volume.type}</> },
  { label: "Size", Comp: ({ volume }) => <>{volume.size} GB</> },
  {
    label: "Availability Zone",
    Comp: ({ volume }) => <>{volume.availabilityZone}</>,
  },
  {
    label: "Is Home Volume",
    Comp: ({ volume }) => <>{volume.homeVolume ? "True" : "False"}</>,
  },
];
