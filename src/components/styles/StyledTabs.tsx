import styled from "@emotion/styled";
import { Tabs } from "@leafygreen-ui/tabs";
import { size } from "constants/tokens";

// @ts-expect-error
export const StyledTabs = styled(Tabs)`
  [role="tablist"] {
    margin-bottom: ${size.s};
  }
`;
