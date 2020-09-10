import React from "react";
import Badge, { Variant } from "components/Badge";
import { Volume } from "gql/generated/types";

interface Props {
  volume: Volume;
}

export const VolumeStatusBadge = ({ volume }: Props) => (
  <Badge
    data-cy="volume-status-badge"
    variant={volume.hostID ? Variant.Green : Variant.Blue}
  >
    {volume.hostID ? "Mounted" : "Free"}
  </Badge>
);
