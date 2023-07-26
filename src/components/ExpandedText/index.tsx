import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Tooltip, { TriggerEvent } from "@leafygreen-ui/tooltip";
import { Disclaimer } from "@leafygreen-ui/typography";
import { zIndex } from "constants/tokens";

const { blue } = palette;

interface ExpandedTextProps {
  message: string;
  triggerEvent?: (typeof TriggerEvent)[keyof typeof TriggerEvent];
  popoverZIndex?: number;
  ["data-cy"]?: string;
}

const ExpandedText: React.VFC<ExpandedTextProps> = ({
  "data-cy": dataCy,
  message,
  popoverZIndex = zIndex.popover,
  triggerEvent = TriggerEvent.Hover,
}) => (
  <Tooltip
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
`;

const MessageWrapper = styled.div`
  max-width: 200px;
`;

export default ExpandedText;
