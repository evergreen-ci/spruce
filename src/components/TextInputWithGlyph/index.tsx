import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";

type TextInputWithGlyphProps = {
  icon: React.ReactElement;
} & React.ComponentProps<typeof TextInput>;

const TextInputWithGlyph: React.VFC<TextInputWithGlyphProps> = (props) => {
  const { icon, label, ...rest } = props;
  const hasLabel = !!label;

  return (
    <TextInputWrapper>
      <TextInput label={label} {...rest} />
      <IconWrapper>
        {hasLabel && <LabelPlaceholder />}
        <CenterIcon>{icon}</CenterIcon>
      </IconWrapper>
    </TextInputWrapper>
  );
};
const TextInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const LabelPlaceholder = styled.div`
  /* Height of the LG TextInput Label and Padding */
  height: 20px;
`;
const CenterIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px; /* Height of the LG TextInput */
`;
const IconWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  top: 0;
  height: 100%;
  margin-top: 0;
  position: absolute;
  right: 10px;
`;

export default TextInputWithGlyph;
