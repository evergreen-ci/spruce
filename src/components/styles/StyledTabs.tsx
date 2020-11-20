import React from "react";
import styled from "@emotion/styled/macro";
import { Tabs, Tab } from "@leafygreen-ui/tabs";

type StyledTabsProps = React.ComponentProps<typeof Tabs>;
export const StyledTabs: React.FC<StyledTabsProps> = ({
  children,
  ...rest
}) => (
  <Tabs {...rest}>
    {children.map((c) => (
      <Tab {...c.props}>
        <PaddedContainer>{c.props.children}</PaddedContainer>
      </Tab>
    ))}
  </Tabs>
);

const PaddedContainer = styled.div`
  margin-top: 12px;
`;
