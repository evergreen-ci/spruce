import styled from "@emotion/styled";
import { Size, glyphs } from "components/Icon";
import { size } from "constants/tokens";
import IconTooltip from ".";

const Sizes = {
  [Size.Small]: 14,
  [Size.Default]: 16,
  [Size.Large]: 20,
  [Size.XLarge]: 24,
};

export default {
  title: "Components/Icons/Tooltip",
  component: IconTooltip,
  args: {
    color: "#000000",
    size: Sizes[Size.Default],
    text: "Tooltip Text",
  },
  argTypes: {
    size: {
      control: { type: "select", options: Sizes },
    },
  },
};

export const Icons = ({ text, size: s, ...rest }) => (
  <Container>
    {Object.keys(glyphs).map((name) => (
      <IconContainer key={name}>
        <IconTooltip glyph={name} size={s} {...rest}>
          {text}
        </IconTooltip>
        <span>{name}</span>
      </IconContainer>
    ))}
  </Container>
);

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
