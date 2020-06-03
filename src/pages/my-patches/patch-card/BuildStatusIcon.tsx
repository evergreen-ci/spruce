import React from "react";
import { BuildStatus } from "types/build";
import { RunningIcon } from "pages/my-patches/patch-card/BuildStatusIcon/RunningIcon";
import { SucceededIcon } from "pages/my-patches/patch-card/BuildStatusIcon/SucceededIcon";
import { FailedIcon } from "pages/my-patches/patch-card/BuildStatusIcon/FailedIcon";
import { CreatedIcon } from "pages/my-patches/patch-card/BuildStatusIcon/CreatedIcon";
import styled from "@emotion/styled";
import { Tooltip } from "antd";

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
    <Tooltip placement="top" title={buildVariant}>
      <IconWrapper onClick={onClick}>{icon}</IconWrapper>
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
