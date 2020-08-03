import React from "react";
import { HostStatus } from "types/host";
import Badge, { Variant } from "@leafygreen-ui/badge";
import styled from "@emotion/styled";

interface Props {
  status: HostStatus;
}

export const HostStatusBadge: React.FC<Props> = ({ status }) => (
  <StyledBadge variant={statusToBadgeVariant[status]}>
    {hostStatusToCopy[status]}
  </StyledBadge>
);

const statusToBadgeVariant = {
  [HostStatus.Running]: Variant.Green,
  [HostStatus.Terminated]: Variant.Red,
  [(HostStatus.Starting, HostStatus.Provisioning)]: Variant.Yellow,
  [(HostStatus.Decommissioned,
  HostStatus.Quarantined,
  HostStatus.ProvisionFailed,
  HostStatus.Uninitialized,
  HostStatus.Building,
  HostStatus.StatusSuccess,
  HostStatus.Stopping,
  HostStatus.Stopped,
  HostStatus.StatusFailed,
  HostStatus.ExternalUserName)]: Variant.LightGray,
};

const hostStatusToCopy = {
  [HostStatus.Running]: "Running",
  [HostStatus.Terminated]: "Terminated",
  [HostStatus.Starting]: "Starting",
  [HostStatus.Provisioning]: "Provisioning",
  [HostStatus.Decommissioned]: "Decommissioned",
  [HostStatus.Quarantined]: "Quarantined",
  [HostStatus.ProvisionFailed]: "Provision Failed",
  [HostStatus.Uninitialized]: "Initializing",
  [HostStatus.Building]: "Building",
  [HostStatus.StatusSuccess]: "Success",
  [HostStatus.Stopping]: "Stopping",
  [HostStatus.Stopped]: "Stopped",
  [HostStatus.StatusFailed]: "Failed",
  [HostStatus.ExternalUserName]: "External",
};

const StyledBadge = styled(Badge)`
  display: flex;
  justify-content: center;
  width: 90px;
`;
