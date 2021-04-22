import React from "react";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import Icon from "components/Icon";
import { BuildStatus } from "types/build";
import { CreatedIcon } from "./buildStatusIcon/CreatedIcon";

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
  [BuildStatus.Failed]: <Icon glyph="FailedIcon" />,
  [BuildStatus.Started]: <Icon glyph="RunningIcon" />,
  [BuildStatus.Succeeded]: <Icon glyph="SucceededIcon" />,
};
