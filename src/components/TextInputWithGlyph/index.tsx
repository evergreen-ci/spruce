import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import Icon from "components/Icon";

type TextInputWithGlyphProps = {
  glyph: string;
} & React.ComponentProps<typeof TextInput>;
const TextInputWithGlyph: React.FC<TextInputWithGlyphProps> = (props) => {
  const { glyph, ...rest } = props;
  return (
    <TextInputWrapper>
      <TextInput {...rest} />
      <StyledIcon glyph={glyph} />
    </TextInputWrapper>
  );
};
const TextInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledIcon = styled(Icon)`
  position: absolute;
  align-self: flex-end;
  margin-right: 10px;
  bottom: 10px;
  &:hover {
    cursor: pointer;
  }
`;

export default TextInputWithGlyph;
