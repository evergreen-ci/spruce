import styled from "@emotion/styled";
import { Tabs, TabsProps } from "@leafygreen-ui/tabs";
import { size } from "constants/tokens";

// @ts-expect-error
export const StyledTabs = styled(Tabs)<TabsProps>`
  > div > [role="tablist"] {
    margin-bottom: ${size.s};
  }
`;
