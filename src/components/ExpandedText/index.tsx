import styled from "@emotion/styled";
import InlineDefinition, {
  InlineDefinitionProps,
} from "@leafygreen-ui/inline-definition";
import { palette } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";

const { blue } = palette;

type ExpandedTextProps = {
  ["data-cy"]?: string;
  message: string;
} & Omit<InlineDefinitionProps, "children" | "definition">;

const ExpandedText: React.FC<ExpandedTextProps> = ({
  "data-cy": dataCy,
  message,
  ...rest
}) => (
  <InlineDefinition {...rest} definition={message}>
    <ButtonText>more</ButtonText>
  </InlineDefinition>
);

const ButtonText = styled(Disclaimer)`
  color: ${blue.dark2};
  text-decoration: underline;
  cursor: default;
  width: fit-content;
  display: inline-block;
`;

export default ExpandedText;
