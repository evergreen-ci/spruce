import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";
import { PlusButton } from "components/Spawn";

export const SpawnVolumeButton = () => (
  <div>
    <PlusButton>Create Volume</PlusButton>
    <Info>Limit 1500 GiB per User</Info>
  </div>
);

const Info = styled(Disclaimer)`
  font-weight: 300;
  padding-left: 8px;
  position: relative;
  top: -2px;
  font-style: italic;
  color: ${uiColors.gray.dark2};
`;
