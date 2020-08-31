import { css } from "@emotion/core";
import styled from "@emotion/styled/macro";
import { uiColors } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";

const { blue } = uiColors;

const linkStyles = css`
  text-decoration: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
  color: ${blue.base};
  &:hover {
    text-decoration: underline;
  }
`;

export const StyledLink = styled.a`
  ${linkStyles}
`;

export const BoldStyledLink = styled.a`
  ${linkStyles}
  font-weight: 500;
  font-size: 12px;
`;

export const StyledRouterLink = styled(Link)`
  ${linkStyles}
`;
