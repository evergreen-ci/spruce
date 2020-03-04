import styled from "@emotion/styled/macro";
import { uiColors } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";

const { blue } = uiColors;

export const StyledLink = styled.a`
  text-decoration: none;
  margin: none;
  padding: none;
  cursor: pointer;
  color: ${blue.base};
  &:hover {
    text-decoration: underline;
  }
`;

export const StyledRouterLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;
