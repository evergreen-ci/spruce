import Badge, { Variant } from "@leafygreen-ui/badge";
import { TableVolume } from "types/spawn";

interface Props {
  volume: TableVolume;
}

export const VolumeStatusBadge = ({ volume }: Props) => {
  const { text, variant } = getBadge(volume.migrating, volume.hostID);
  return (
    <Badge data-cy="volume-status-badge" variant={variant}>
      {text}
    </Badge>
  );
};

const getBadge = (
  migrating: boolean,
  hostID?: string
): { text: string; variant: Variant } => {
  if (migrating) {
    return {
      text: "Migrating",
      variant: Variant.Yellow,
    };
  }

  if (hostID) {
    return {
      text: "Mounted",
      variant: Variant.Green,
    };
  }

  return {
    text: "Free",
    variant: Variant.Blue,
  };
};
