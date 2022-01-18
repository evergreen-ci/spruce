import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip, { TriggerEvent } from "@leafygreen-ui/tooltip";
import { Disclaimer } from "@leafygreen-ui/typography";

const { blue } = uiColors;

interface ExpandedTextProps {
  message: string;
  triggerEvent?: typeof TriggerEvent[keyof typeof TriggerEvent];
  zIndex?: number;
  ["data-cy"]?: string;
}

const ExpandedText: React.FC<ExpandedTextProps> = ({
  message,
  triggerEvent = TriggerEvent.Hover,
  zIndex = 0,
  "data-cy": dataCy,
}) => (
  <Tooltip
    trigger={<ButtonText>more</ButtonText>}
    triggerEvent={triggerEvent}
    popoverZIndex={zIndex}
  >
    <MessageWrapper data-cy={dataCy}>{message}</MessageWrapper>
  </Tooltip>
);

const ButtonText = styled(Disclaimer)`
  color: ${blue.dark2};
  text-decoration: underline;
  cursor: default;
`;

const MessageWrapper = styled.div`
  max-width: 200px;
`;

export default ExpandedText;
