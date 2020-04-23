import React from "react";
import { PatchStatus } from "types/patch";
import Badge, { Variant } from "@leafygreen-ui/badge";

interface Props {
  status: String;
}

export const PatchStatusBadge: React.FC<Props> = ({ status }) => (
  <Badge variant={mapPatchStatusToBadgeVariant[status as PatchStatus]}>
    {status}
  </Badge>
);

const mapPatchStatusToBadgeVariant = {
  [PatchStatus.Created]: Variant.LightGray,
  [PatchStatus.Failed]: Variant.Red,
  [PatchStatus.Started]: Variant.Yellow,
  [PatchStatus.Success]: Variant.Green,
};
