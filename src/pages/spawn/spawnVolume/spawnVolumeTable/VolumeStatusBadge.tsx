import Badge, { Variant } from "components/Badge";
import { MyVolume } from "types/spawn";

interface Props {
  volume: MyVolume;
}

export const VolumeStatusBadge = ({ volume }: Props) => (
  <Badge
    data-cy="volume-status-badge"
    variant={volume.hostID ? Variant.Green : Variant.Blue}
  >
    {volume.hostID ? "Mounted" : "Free"}
  </Badge>
);
