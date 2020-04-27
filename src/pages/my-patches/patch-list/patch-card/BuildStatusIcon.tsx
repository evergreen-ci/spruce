import React from "react";
import { BuildStatus } from "types/build";
import { RunningIcon } from "pages/my-patches/patch-card-list/patch-card/BuildStatusIcon/RunningIcon";
import { SucceededIcon } from "pages/my-patches/patch-card-list/patch-card/BuildStatusIcon/SucceededIcon";
import { FailedIcon } from "pages/my-patches/patch-card-list/patch-card/BuildStatusIcon/FailedIcon";
import { CreatedIcon } from "pages/my-patches/patch-card-list/patch-card/BuildStatusIcon/CreatedIcon";
import Tooltip from "@leafygreen-ui/tooltip";

interface Props {
  status: BuildStatus;
  buildVariant: string;
}

export const BuildStatusIcon: React.FC<Props> = ({ status, buildVariant }) => {
  const icon = statusToIcon[status];
  if (!icon) {
    return null;
  }

  return (
    <Tooltip
      triggerEvent="hover"
      trigger={<div>{icon}</div>}
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
