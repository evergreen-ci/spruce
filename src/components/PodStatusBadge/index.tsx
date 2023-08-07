import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";

import { PodStatus } from "types/pod";

interface Props {
  status: PodStatus;
}

const PodStatusBadge: React.FC<Props> = ({ status }) => (
  <PodStatusWrapper>
    <Badge variant={statusToBadgeVariant[status]}>
      {podStatusToCopy[status]}
    </Badge>
  </PodStatusWrapper>
);

const statusToBadgeVariant = {
  [PodStatus.Decommissioned]: Variant.LightGray,
  [PodStatus.Initializing]: Variant.LightGray,
  [PodStatus.Running]: Variant.Green,
  [PodStatus.Starting]: Variant.Yellow,
  [PodStatus.Terminated]: Variant.Red,
};

const podStatusToCopy = {
  [PodStatus.Decommissioned]: "Decommissioned",
  [PodStatus.Initializing]: "Initializing",
  [PodStatus.Running]: "Running",
  [PodStatus.Starting]: "Starting",
  [PodStatus.Terminated]: "Terminated",
};

const PodStatusWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default PodStatusBadge;
