import { css } from "@emotion/react";
import { uiColors } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { gray, white } = uiColors;

export const tableInputContainerCSS = css`
  background: ${white};
  background-color: ${white};
  border-radius: ${size.xxs}px;
  background-color: ${white};
  border: 1px solid ${gray.light1};
  padding: ${size.xs}px;
  box-shadow: 0 ${size.xxs}px ${size.xs}px 0 rgba(231, 238, 236, 0.5);
  overflow: hidden;
`;
