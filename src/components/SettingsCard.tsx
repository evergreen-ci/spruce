import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { H3, H3Props } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";

export const SettingsCardTitle = styled(H3)<H3Props>`
  margin: ${size.m} 0 ${size.s} 0;
`;

export const formComponentSpacingCSS = "margin-bottom: 48px;";

export const SettingsCard = styled(Card)`
  padding: ${size.m};

  ${formComponentSpacingCSS}
`;
