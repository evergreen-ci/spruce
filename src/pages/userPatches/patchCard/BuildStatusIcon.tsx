import React from "react";
import { BuildStatus } from "types/build";
import { RunningIcon } from "pages/userPatches/patchCard/BuildStatusIcon/RunningIcon";
import { SucceededIcon } from "pages/userPatches/patchCard/BuildStatusIcon/SucceededIcon";
import { FailedIcon } from "pages/userPatches/patchCard/BuildStatusIcon/FailedIcon";
import { CreatedIcon } from "pages/userPatches/patchCard/BuildStatusIcon/CreatedIcon";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";

interface Props {
  status: string;
  buildVariant: string;
  href: string;
  onClick?: () => void;
}

export const BuildStatusIcon: React.FC<Props> = ({
  status,
  buildVariant,
  href,
  onClick = () => undefined,
}) => {
  const icon = statusToIcon[status];
  if (!icon) {
    return null;
  }
  return (
    <Tooltip placement="top" title={buildVariant}>
      <Link data-cy="build-status-icon-link" to={href} onClick={onClick}>
        {icon}
      </Link>
    </Tooltip>
  );
};

const statusToIcon = {
  [BuildStatus.Created]: <CreatedIcon />,
  [BuildStatus.Failed]: <FailedIcon />,
  [BuildStatus.Started]: <RunningIcon />,
  [BuildStatus.Succeeded]: <SucceededIcon />,
};
