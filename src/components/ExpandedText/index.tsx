import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Tooltip, { TriggerEvent, Align, Justify } from "@leafygreen-ui/tooltip";
import { Disclaimer } from "@leafygreen-ui/typography";
import { zIndex } from "constants/tokens";

const { blue } = palette;

interface ExpandedTextProps {
  align?: Align;
  ["data-cy"]?: string;
  justify?: Justify;
  message: string;
  popoverZIndex?: number;
  triggerEvent?: (typeof TriggerEvent)[keyof typeof TriggerEvent];
}

const ExpandedText: React.FC<ExpandedTextProps> = ({
  align,
  "data-cy": dataCy,
  justify,
  message,
  popoverZIndex = zIndex.popover,
  triggerEvent = TriggerEvent.Hover,
}) => (
  <Tooltip
    align={align}
    justify={justify}
    trigger={<ButtonText>more</ButtonText>}
    triggerEvent={triggerEvent}
    popoverZIndex={popoverZIndex}
  >
    <MessageWrapper data-cy={dataCy}>{message}</MessageWrapper>
  </Tooltip>
);

const ButtonText = styled(Disclaimer)`
  color: ${blue.dark2};
  text-decoration: underline;
  cursor: default;
  width: fit-content;
  display: inline-block;
`;

const MessageWrapper = styled.div`
  max-width: 200px;
`;

export default ExpandedText;
