import { useEffect } from "react";
import styled from "@emotion/styled";
import { action } from "@storybook/addon-actions";
import { CustomStoryObj, CustomMeta } from "test_utils/types";

import VisibilityContainer from ".";

export default {
  component: VisibilityContainer,
} satisfies CustomMeta<typeof VisibilityContainer>;

export const Default: CustomStoryObj<typeof VisibilityContainer> = {
  render: () => (
    <>
      Scroll the below container out of view and observe the component mounting
      and unmounting
      <ScrollableContainer>
        <InnerContainer>
          <VisibilityContainer>
            <RenderedContent />
          </VisibilityContainer>
        </InnerContainer>
      </ScrollableContainer>
    </>
  ),
};

const RenderedContent = () => {
  useEffect(() => {
    action("RenderedContent mounted")();
    return () => {
      action("RenderedContent unmounted")();
    };
  }, []);
  return <div>Visible content</div>;
};

const ScrollableContainer = styled.div`
  height: 100px;
  overflow: scroll;
  background-color: gray;
`;

const InnerContainer = styled.div`
  height: 200px;
`;
