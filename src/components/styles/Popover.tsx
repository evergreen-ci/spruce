import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { white, gray } = palette;

export const PopoverContainer = styled.div`
  background-color: ${white};
  border-radius: ${size.s};
  box-shadow: 0px 2px 4px -1px ${gray.base};
  display: flex;
  flex-direction: column;
  padding: ${size.s};
`;
