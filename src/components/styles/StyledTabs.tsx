import React from "react";
import styled from "@emotion/styled";
import { Tabs, Tab } from "@leafygreen-ui/tabs";

type StyledTabsProps = React.ComponentProps<typeof Tabs>;
export const StyledTabs: React.VFC<StyledTabsProps> = ({
  children,
  ...rest
}) => (
  <Tabs {...rest}>
    {children.map(
      (c) =>
        c && (
          <Tab {...c.props} key={`styled_tab_${c.key || c.props.name}`}>
            <PaddedContainer>{c.props.children}</PaddedContainer>
          </Tab>
        )
    )}
  </Tabs>
);

const PaddedContainer = styled.div`
  margin-top: 12px;
`;
