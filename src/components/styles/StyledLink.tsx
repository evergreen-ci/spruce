import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { fontSize } from "constants/tokens";

const { blue } = palette;

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
  font-size: ${fontSize.m};
`;

export const StyledRouterLink = styled(Link)`
  ${linkStyles}
`;
