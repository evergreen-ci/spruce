import Badge, { Variant } from "@leafygreen-ui/badge";
import { PatchStatus } from "types/patch";

interface Props {
  status: string;
}

export const PatchStatusBadge: React.FC<Props> = ({ status }) => (
  <Badge variant={statusToBadgeVariant[status as PatchStatus]}>
    {patchStatusToCopy[status as PatchStatus]}
  </Badge>
);

const statusToBadgeVariant = {
  unconfigured: Variant.LightGray,
  [PatchStatus.Created]: Variant.LightGray,
  [PatchStatus.Failed]: Variant.Red,
  [PatchStatus.Started]: Variant.Yellow,
  [PatchStatus.LegacySucceeded]: Variant.Green,
  [PatchStatus.Success]: Variant.Green,
  [PatchStatus.Aborted]: Variant.LightGray,
};

const patchStatusToCopy = {
  unconfigured: "Unconfigured",
  [PatchStatus.Created]: "Created",
  [PatchStatus.Failed]: "Failed",
  [PatchStatus.Started]: "Running",
  [PatchStatus.LegacySucceeded]: "Succeeded",
  [PatchStatus.Success]: "Succeeded",
  [PatchStatus.Aborted]: "Aborted",
};
