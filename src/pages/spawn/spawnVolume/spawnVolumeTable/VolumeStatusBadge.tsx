import React from "react";
import Badge, { Variant } from "components/Badge";
import { MyVolumesQuery } from "gql/generated/types";

interface Props {
  volume: MyVolumesQuery["myVolumes"][0];
}

export const VolumeStatusBadge = ({ volume }: Props) => (
  <Badge
    data-cy="volume-status-badge"
    variant={volume.hostID ? Variant.Green : Variant.Blue}
  >
    {volume.hostID ? "Mounted" : "Free"}
  </Badge>
);
