import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { white, gray } = palette;

export const PopoverContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${white};
  padding: ${size.s};
  box-shadow: 0px 2px 4px -1px ${gray.base};
`;
