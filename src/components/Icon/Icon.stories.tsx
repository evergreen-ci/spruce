import styled from "@emotion/styled";
import { withKnobs, select, color } from "@storybook/addon-knobs";
import { Size } from "components/Icon";
import Icon, { glyphs } from "./index";

export default {
  title: "Spruce Icons",
  decorators: [withKnobs],
};

export const Icons = () => (
  <Container>
    {Object.keys(glyphs).map((name) => (
      <IconContainer key={name}>
        <Icon
          glyph={name}
          size={select("Size", Sizes, Sizes[Size.Default])}
          fill={color("Color", "black")}
        />
        <span>{name}</span>
      </IconContainer>
    ))}
  </Container>
);

const Sizes = {
  [Size.Small]: 14,
  [Size.Default]: 16,
  [Size.Large]: 20,
  [Size.XLarge]: 24,
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const IconContainer = styled.div`
  width: 150px;
  height: 70px;
  flex-shrink: 0;
  text-align: center;
  border: 1px solid #babdbe;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0.5rem;
`;
