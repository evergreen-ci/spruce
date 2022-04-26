import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import { size } from "constants/tokens";

type TextInputWithGlyphProps = {
  icon: React.ReactElement;
} & React.ComponentProps<typeof TextInput>;

const TextInputWithGlyph: React.VFC<TextInputWithGlyphProps> = (props) => {
  const { icon, label, ...rest } = props;
  const hasLabel = !!label;

  return (
    <TextInputWrapper>
      <TextInput label={label} {...rest} />
      <IconWrapper hasLabel={hasLabel}>{icon}</IconWrapper>
    </TextInputWrapper>
  );
};
const TextInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const IconWrapper = styled.div<{ hasLabel: boolean }>`
  align-items: center;
  display: flex;
  top: 0;
  /* size.l is half of the height of the LG TextInput label and padding */
  margin-top: ${({ hasLabel }) => (hasLabel ? size.l : 0)};
  position: absolute;
  right: 10px;
`;

export default TextInputWithGlyph;
