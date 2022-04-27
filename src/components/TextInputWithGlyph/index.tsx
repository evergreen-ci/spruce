import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import { size } from "constants/tokens";

type TextInputWithGlyphProps = {
  icon: React.ReactElement;
} & React.ComponentProps<typeof TextInput>;

const TextInputWithGlyph: React.VFC<TextInputWithGlyphProps> = (props) => {
  const { icon, ...rest } = props;

  return (
    <TextInputWrapper>
      <TextInput {...rest} />
      <IconWrapper>{icon}</IconWrapper>
    </TextInputWrapper>
  );
};
const TextInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const IconWrapper = styled.div`
  align-items: center;
  display: flex;
  bottom: 0;
  height: 36px; /* height of LG text-input */
  position: absolute;
  right: ${size.xxs};
  width: ${size.l};
  justify-content: center;
`;

export default TextInputWithGlyph;
