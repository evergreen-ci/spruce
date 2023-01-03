import styled from "@emotion/styled";
import { Tabs } from "@leafygreen-ui/tabs";
import { size } from "constants/tokens";
import { TabsType } from "types/leafygreen";

export const StyledTabs = styled<TabsType>(Tabs)`
  > div > [role="tablist"] {
    margin-bottom: ${size.s};
  }
`;
