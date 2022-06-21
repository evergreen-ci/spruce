import styled from "@emotion/styled";
import { size } from "constants/tokens";
import Icon, { glyphs, Size } from "./index";

const Sizes = {
  [Size.Small]: 14,
  [Size.Default]: 16,
  [Size.Large]: 20,
  [Size.XLarge]: 24,
};

export default {
  title: "Spruce Icons",
  component: Icon,
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

export const Icons = ({ size: s, ...rest }) => (
  <Container>
    {Object.keys(glyphs).map((name) => (
      <IconContainer key={name}>
        <Icon glyph={name} size={s} {...rest} />
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
