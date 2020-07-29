import React from "react";
import { HostStatus } from "types/host";
import Badge, { Variant } from "@leafygreen-ui/badge";
import styled from "@emotion/styled";

interface Props {
  status: string;
}

export const HostStatusBadge: React.FC<Props> = ({ status }) => (
  <StyledBadge variant={statusToBadgeVariant[status as HostStatus]}>
    {hostStatusToCopy[status as HostStatus]}
  </StyledBadge>
);

const statusToBadgeVariant = {
  [HostStatus.HostRunning]: Variant.Green,
  [HostStatus.HostTerminated]: Variant.Red,
  [(HostStatus.HostStarting, HostStatus.HostProvisioning)]: Variant.Yellow,
  [(HostStatus.HostDecommissioned,
  HostStatus.HostQuarantined,
  HostStatus.HostProvisionFailed,
  HostStatus.HostUninitialized,
  HostStatus.HostBuilding,
  HostStatus.HostStatusSuccess,
  HostStatus.HostStopping,
  HostStatus.HostStopped,
  HostStatus.HostStatusFailed,
  HostStatus.HostExternalUserName)]: Variant.LightGray,
};

const hostStatusToCopy = {
  [HostStatus.HostRunning]: "Running",
  [HostStatus.HostTerminated]: "Terminated",
  [HostStatus.HostStarting]: "Starting",
  [HostStatus.HostProvisioning]: "Provisioning",
  [HostStatus.HostDecommissioned]: "Decommissioned",
  [HostStatus.HostQuarantined]: "Quarantined",
  [HostStatus.HostProvisionFailed]: "Provision Failed",
  [HostStatus.HostUninitialized]: "Initializing",
  [HostStatus.HostBuilding]: "Building",
  [HostStatus.HostStatusSuccess]: "Success",
  [HostStatus.HostStopping]: "Stopping",
  [HostStatus.HostStopped]: "Stopped",
  [HostStatus.HostStatusFailed]: "Failed",
  [HostStatus.HostExternalUserName]: "External",
};

const StyledBadge = styled(Badge)`
  display: flex;
  justify-content: center;
  width: 90px;
`;
