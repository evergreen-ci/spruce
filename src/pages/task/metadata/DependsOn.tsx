import React from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";
import { BoldStyledLink } from "components/styles";
import { MetStatus, RequiredStatus, Dependency } from "gql/generated/types";

export const DependsOn: React.FC<Dependency> = ({
  buildVariant,
  metStatus,
  name,
  requiredStatus,
  uiLink,
}) => (
  <DependsOnWrapper>
    <LeftContainer>{metStatusToIcon[metStatus]}</LeftContainer>
    <RightContainer>
      <BoldStyledLink data-cy="depends-on-link" href={uiLink}>
        {name}
      </BoldStyledLink>
      <Subtitle>in {buildVariant}</Subtitle>
      {requiredStatusToBadge[requiredStatus]}
    </RightContainer>
  </DependsOnWrapper>
);

const DependsOnWrapper = styled.div`
  display: flex;
  padding-bottom: 8px;
`;

const LeftContainer = styled.div`
  width: 25px;
  padding-top: 10px;
  padding-right: 9px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Subtitle = styled(Disclaimer)`
  padding-bottom: 3px;
`;

const metStatusToIcon = {
  [MetStatus.Met]: <Icon fill={uiColors.green.base} glyph="Checkmark" />,
  [MetStatus.Unmet]: <Icon fill={uiColors.red.base} glyph="X" />,
  [MetStatus.Pending]: <></>,
};

const requiredStatusToBadge = {
  [RequiredStatus.MustFail]: <Badge variant={Variant.Red}>MUST FAIL</Badge>,
  [RequiredStatus.MustFinish]: (
    <Badge variant={Variant.Blue}>MUST FINISH</Badge>
  ),
  [RequiredStatus.MustSucceed]: (
    <Badge variant={Variant.Green}>MUST SUCCEED</Badge>
  ),
};
