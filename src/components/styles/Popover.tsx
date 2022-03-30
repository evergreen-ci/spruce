import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { white, gray } = uiColors;

export const PopoverContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${white};
  padding: ${size.s};
  box-shadow: 0 ${size.xxs} ${size.xs} 0 ${gray.light2},
    0 ${size.xxs} ${size.l} ${size.xxs} ${gray.light2};
`;
