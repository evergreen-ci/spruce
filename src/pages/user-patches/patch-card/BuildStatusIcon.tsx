import React from "react";
import { BuildStatus } from "types/build";
import { RunningIcon } from "pages/user-patches/patch-card/BuildStatusIcon/RunningIcon";
import { SucceededIcon } from "pages/user-patches/patch-card/BuildStatusIcon/SucceededIcon";
import { FailedIcon } from "pages/user-patches/patch-card/BuildStatusIcon/FailedIcon";
import { CreatedIcon } from "pages/user-patches/patch-card/BuildStatusIcon/CreatedIcon";
import Tooltip from "@leafygreen-ui/tooltip";
import styled from "@emotion/styled";

interface Props {
  status: string;
  buildVariant: string;
  onClick: () => void;
}

export const BuildStatusIcon: React.FC<Props> = ({
  status,
  buildVariant,
  onClick,
}) => {
  const icon = statusToIcon[status];
  if (!icon) {
    return null;
  }

  return (
    <Tooltip
      triggerEvent="hover"
      trigger={<IconWrapper onClick={onClick}>{icon}</IconWrapper>}
      variant="light"
      justify="middle"
      align="top"
    >
      {buildVariant}
    </Tooltip>
  );
};

const statusToIcon = {
  [BuildStatus.Created]: <CreatedIcon />,
  [BuildStatus.Failed]: <FailedIcon />,
  [BuildStatus.Started]: <RunningIcon />,
  [BuildStatus.Succeeded]: <SucceededIcon />,
};

const IconWrapper = styled.div`
  cursor: pointer;
`;
