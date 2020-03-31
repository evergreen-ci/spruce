import styled from "@emotion/styled/macro";
import { uiColors } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { css } from "@emotion/core";

const { blue } = uiColors;

const linkStyles = css`
  text-decoration: none;
  margin: none;
  padding: none;
  cursor: pointer;
  color: ${blue.base} !important;
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
