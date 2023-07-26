import styled from "@emotion/styled";
import { Size, glyphs } from "components/Icon";
import { size } from "constants/tokens";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import IconTooltip, { IconTooltipProps } from ".";

const Sizes = {
  [Size.Small]: 14,
  [Size.Default]: 16,
  [Size.Large]: 20,
  [Size.XLarge]: 24,
};

export default {
  component: IconTooltip,
  title: "Components/Icon/Tooltip",
} satisfies CustomMeta<typeof IconTooltip>;

export const Icons: CustomStoryObj<IconTooltipProps> = {
  argTypes: {
    color: { control: "color" },
    size: {
      control: { type: "select" },
      options: Object.values(Sizes),
    },
  },
  args: {
    children: "Tooltip Text",
    color: "#000000",
    size: Sizes[Size.Default],
  },
  render: ({ children, size: s, ...rest }) => (
    <Container>
      {Object.keys(glyphs).map((name) => (
        <IconContainer key={name}>
          <IconTooltip glyph={name} size={s} {...rest}>
            {children}
          </IconTooltip>
          <span>{name}</span>
        </IconContainer>
      ))}
    </Container>
  ),
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
