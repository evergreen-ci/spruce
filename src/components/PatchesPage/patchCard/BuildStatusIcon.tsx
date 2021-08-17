import React from "react";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { BuildStatus } from "types/build";
import { TaskStatus } from "types/task";
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
  [BuildStatus.Failed]: <TaskStatusIcon status={TaskStatus.Failed} />,
  [BuildStatus.Started]: <TaskStatusIcon status={TaskStatus.Dispatched} />,
  [BuildStatus.Succeeded]: <TaskStatusIcon status={TaskStatus.Succeeded} />,
};
