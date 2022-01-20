import styled from "@emotion/styled";
import { withKnobs, number } from "@storybook/addon-knobs";
import StickyContainer from ".";

export default {
  title: "Sticky Container",
  component: StickyContainer,
  decorators: [withKnobs],
};

export const StickyContainerStory = () => (
  <Page>
    {Array.from({ length: 50 }).map((_, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={`${i}top`}>Some Element</div>
    ))}
    <StickyContainer offset={number("offset", 0)}>
      <StickyElement>I am supposed to stick</StickyElement>
    </StickyContainer>
    {Array.from({ length: 50 }).map((_, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={`${i}bottom`}>Some Element</div>
    ))}
  </Page>
);

const StickyElement = styled.div`
  background-color: blue;
`;
const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
`;
