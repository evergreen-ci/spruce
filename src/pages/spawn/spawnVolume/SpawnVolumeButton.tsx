import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";
import { PlusButton } from "components/Spawn";

interface SpawnVolumeButtonProps {
  showMetadata: boolean;
}
export const SpawnVolumeButton: React.FC<SpawnVolumeButtonProps> = ({
  showMetadata,
}) => (
  <PaddedContainer showMetadata={showMetadata}>
    <PlusButton>Create Volume</PlusButton>
    {showMetadata && <Info>Limit 1500 GiB per User</Info>}
  </PaddedContainer>
);

const PaddedContainer = styled.div`
  ${(props: SpawnVolumeButtonProps) =>
    props.showMetadata
      ? `
   padding-top: 30px;
padding-bottom: 30px;
`
      : `margin-top: 22px;`}
`;

const Info = styled(Disclaimer)`
  font-weight: 300;
  padding-left: 8px;
  position: relative;
  top: -2px;
  font-style: italic;
  color: ${uiColors.gray.dark2};
`;
