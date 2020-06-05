import React from "react";
import { BuildStatus } from "types/build";
import { RunningIcon } from "pages/userPatches/patchCard/BuildStatusIcon/RunningIcon";
import { SucceededIcon } from "pages/userPatches/patchCard/BuildStatusIcon/SucceededIcon";
import { FailedIcon } from "pages/userPatches/patchCard/BuildStatusIcon/FailedIcon";
import { CreatedIcon } from "pages/userPatches/patchCard/BuildStatusIcon/CreatedIcon";
import { Tooltip } from "antd";

interface Props {
  status: string;
  buildVariant: string;
  href: string;
}

export const BuildStatusIcon: React.FC<Props> = ({
  status,
  buildVariant,
  href,
}) => {
  const icon = statusToIcon[status];
  if (!icon) {
    return null;
  }
  return (
    <Tooltip placement="top" title={buildVariant}>
      <a data-cy="build-status-icon-link" href={href}>
        {icon}
      </a>
    </Tooltip>
  );
};

const statusToIcon = {
  [BuildStatus.Created]: <CreatedIcon />,
  [BuildStatus.Failed]: <FailedIcon />,
  [BuildStatus.Started]: <RunningIcon />,
  [BuildStatus.Succeeded]: <SucceededIcon />,
};
