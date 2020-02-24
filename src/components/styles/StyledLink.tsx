import styled from "@emotion/styled/macro";
import { uiColors } from "@leafygreen-ui/palette";

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
