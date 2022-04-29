import styled from "@emotion/styled";
import { withKnobs, select, color, text } from "@storybook/addon-knobs";
import { Size, glyphs } from "components/Icon";
import { size } from "constants/tokens";
import IconTooltip from ".";

export default {
  title: "Icon Tooltip",
  decorators: [withKnobs],
  component: IconTooltip,
};

export const Icons = () => (
  <Container>
    {Object.keys(glyphs).map((name) => (
      <IconContainer key={name}>
        <IconTooltip
          glyph={name}
          size={select("Size", Sizes, Sizes[Size.Default])}
          fill={color("Color", "black")}
        >
          {text("Tooltip Text", "Tooltip Text")}
        </IconTooltip>
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
  border-radius: ${size.xxs};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0.5rem;
`;
