import styled from "@emotion/styled/macro";
import { blueBase } from "../../contants/colors";

export const StyledLink = styled.a`
  text-decoration: none;
  margin: none;
  padding: none;
  cursor: pointer;
  color: ${blueBase};
  &:hover {
    text-decoration: underline;
  }
`;
