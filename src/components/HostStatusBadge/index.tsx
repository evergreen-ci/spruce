import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import IconTooltip from "components/IconTooltip";
import { size } from "constants/tokens";
import { HostStatus } from "types/host";

const { red } = palette;

interface Props {
  status: HostStatus;
}

const HostStatusBadge: React.FC<Props> = ({ status }) => (
  <HostStatusWrapper>
    <Badge variant={statusToBadgeVariant[status]}>
      {hostStatusToCopy[status]}
    </Badge>
    {status === HostStatus.Terminated && (
      <IconTooltip fill={red.base} glyph="InfoWithCircle" css={iconMargin}>
        Terminated hosts will disappear in 5 minutes. See Event Log for more
        details.
      </IconTooltip>
    )}
  </HostStatusWrapper>
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

const HostStatusWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const iconMargin = css`
  margin-left: ${size.xxs};
`;

export default HostStatusBadge;
