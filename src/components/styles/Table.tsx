import { css } from "@emotion/react";
import { uiColors } from "@leafygreen-ui/palette";

const { gray, white } = uiColors;

export const tableInputContainerCSS = css`
  background: ${white};
  background-color: ${white};
  border-radius: 5px;
  background-color: ${white};
  border: 1px solid ${gray.light1};
  padding: 8px;
  box-shadow: 0 3px 8px 0 rgba(231, 238, 236, 0.5);
  overflow: hidden;
`;
