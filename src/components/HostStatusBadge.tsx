import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { size } from "constants/tokens";
import { HostStatus } from "types/host";

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
  [HostStatus.Provisioning]: Variant.Yellow,
  [HostStatus.Starting]: Variant.Yellow,
  [HostStatus.Decommissioned]: Variant.LightGray,
  [HostStatus.Quarantined]: Variant.LightGray,
  [HostStatus.ProvisionFailed]: Variant.LightGray,
  [HostStatus.Uninitialized]: Variant.LightGray,
  [HostStatus.Building]: Variant.LightGray,
  [HostStatus.Success]: Variant.LightGray,
  [HostStatus.Stopping]: Variant.LightGray,
  [HostStatus.Stopped]: Variant.LightGray,
  [HostStatus.Failed]: Variant.LightGray,
  [HostStatus.ExternalUserName]: Variant.LightGray,
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
  [HostStatus.Success]: "Success",
  [HostStatus.Stopping]: "Stopping",
  [HostStatus.Stopped]: "Stopped",
  [HostStatus.Failed]: "Failed",
  [HostStatus.ExternalUserName]: "External",
};

const StyledBadge = styled(Badge)`
  display: flex;
  justify-content: center;
  width: ${size.xxl};
`;
