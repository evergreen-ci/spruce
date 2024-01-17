import Badge, { Variant } from "@leafygreen-ui/badge";

interface Props {
  migrating: boolean;
  hostId?: string;
}

export const VolumeStatusBadge: React.FC<Props> = ({ hostId, migrating }) => {
  const { text, variant } = getBadge(migrating, hostId);
  return (
    <Badge data-cy="volume-status-badge" variant={variant}>
      {text}
    </Badge>
  );
};

const getBadge = (
  migrating: boolean,
  hostId?: string,
): { text: string; variant: Variant } => {
  if (migrating) {
    return {
      text: "Migrating",
      variant: Variant.Yellow,
    };
  }

  if (hostId) {
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
