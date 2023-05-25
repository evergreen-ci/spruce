import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { H3 } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { H3Type } from "types/leafygreen";

export const SettingsCardTitle = styled<H3Type>(H3)`
  margin: ${size.m} 0;
`;

export const formComponentSpacingCSS = "margin-bottom: 48px;";

export const SettingsCard = styled(Card)`
  padding: ${size.m};

  :not(:last-of-type) {
    ${formComponentSpacingCSS}
  }
`;
