import React from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "components/Badge";
import { PatchStatus } from "types/patch";

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
  [PatchStatus.Aborted]: Variant.LightGray,
};

const patchStatusToCopy = {
  [PatchStatus.Created]: "Created",
  [PatchStatus.Failed]: "Failed",
  [PatchStatus.Started]: "Running",
  [PatchStatus.Success]: "Succeeded",
  [PatchStatus.Aborted]: "Aborted",
};

const StyledBadge = styled(Badge)`
  display: flex;
  justify-content: center;
  width: 90px;
`;
