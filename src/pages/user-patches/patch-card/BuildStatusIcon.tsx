import React from "react";
import { BuildStatus } from "types/build";
import { RunningIcon } from "pages/user-patches/patch-card/BuildStatusIcon/RunningIcon";
import { SucceededIcon } from "pages/user-patches/patch-card/BuildStatusIcon/SucceededIcon";
import { FailedIcon } from "pages/user-patches/patch-card/BuildStatusIcon/FailedIcon";
import { CreatedIcon } from "pages/user-patches/patch-card/BuildStatusIcon/CreatedIcon";
import styled from "@emotion/styled";
import { paths, DEFAULT_PATCH_TAB } from "constants/routes";
import { id } from "date-fns/locale";
import { PatchTasksQueryParams } from "types/task";
import { useHistory } from "react-router-dom";
import { Tooltip } from "antd";

interface Props {
  status: string;
  buildVariant: string;
}

export const BuildStatusIcon: React.FC<Props> = ({ status, buildVariant }) => {
  const router = useHistory();
  const onClick = () =>
    router.push(
      `${paths.patch}/${id}/${DEFAULT_PATCH_TAB}?${PatchTasksQueryParams.Variant}=${buildVariant}`
    );
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
