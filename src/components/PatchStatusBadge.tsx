import Badge, { Variant } from "@leafygreen-ui/badge";
import { PatchStatus } from "types/patch";

interface Props {
  status: string;
}

export const PatchStatusBadge: React.VFC<Props> = ({ status }) => (
  <Badge variant={statusToBadgeVariant[status as PatchStatus]}>
    {patchStatusToCopy[status as PatchStatus]}
  </Badge>
);

const statusToBadgeVariant = {
  [PatchStatus.Created]: Variant.LightGray,
  [PatchStatus.Failed]: Variant.Red,
  [PatchStatus.Started]: Variant.Yellow,
  [PatchStatus.Success]: Variant.Green,
  [PatchStatus.Aborted]: Variant.LightGray,
};

const patchStatusToCopy = {
  [PatchStatus.Created]: "Created",
  [PatchStatus.Failed]: "Failed",
  [PatchStatus.Started]: "Running",
  [PatchStatus.Success]: "Succeeded",
  [PatchStatus.Aborted]: "Aborted",
};
