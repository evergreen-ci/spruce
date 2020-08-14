import React from "react";
import styled from "@emotion/styled";

import Button, { Size } from "@leafygreen-ui/button";
import Icon from "components/icons/Icon";
import { Host } from "gql/generated/types";

import { HostStatus } from "types/host";

export const SpawnHostActionButton: React.FC<{ host: Host }> = ({ host }) => {
  const action = mapStatusToAction[host.status];
  return <PaddedButton glyph={<Icon glyph={action} />} size={Size.Small} />;
};
const mapStatusToAction = {
  [HostStatus.Running]: "Pause",
  [HostStatus.Stopped]: "Start",
};

const PaddedButton = styled(Button)`
  margin-left: 5px;
  margin-right: 5px;
`;
