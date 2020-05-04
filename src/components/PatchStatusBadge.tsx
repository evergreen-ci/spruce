import React from "react";
import { PatchStatus } from "types/patch";
import Badge, { Variant } from "@leafygreen-ui/badge";
import styled from "@emotion/styled";

interface Props {
  status: string;
}


export const PatchStatusBadge: React.FC<Props> = ({ status }) => (
  <StyledBadge variant={statusToBadgeVariant[status as PatchStatus]}>
        {patchStatusToCopy[status as PatchStatus]}
  </StyledBadge>
);

const statusToBadgeVariant = {
  [PatchStatus.Created]: Variant.LightGray,
  [PatchStatus.Failed]: Variant.Red,
  [PatchStatus.Started]: Variant.Yellow,
  [PatchStatus.Success]: Variant.Green,
};

const patchStatusToCopy = {
  [PatchStatus.Created]: "Created",
  [PatchStatus.Failed]: "Failed",
  [PatchStatus.Started]: "Running",
  [PatchStatus.Success]: "Succeeded",
};

const StyledBadge = styled(Badge)`
  display:flex;
  justify-content: center;
  width: 90px;
`