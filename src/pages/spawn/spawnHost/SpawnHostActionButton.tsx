import React from "react";
import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import Icon from "components/icons/Icon";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";

export const SpawnHostActionButton: React.FC<{ host: MyHost }> = ({ host }) => {
  const action = mapStatusToAction[host.status];

  return action ? (
    <PaddedButton glyph={<Icon glyph={action} />} size={Size.XSmall} />
  ) : null;
};
const mapStatusToAction = {
  [HostStatus.Running]: "Pause",
  [HostStatus.Stopped]: "Play",
};

const PaddedButton = styled(Button)`
  margin-left: 5px;
  margin-right: 5px;
`;
