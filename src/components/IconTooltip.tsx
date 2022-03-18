import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { size } from "constants/tokens";

interface IconTooltipProps {
  tooltipText: string;
  iconType: string;
  color: string;
}

export const IconTooltip: React.FC<IconTooltipProps> = ({
  tooltipText,
  iconType,
  color,
}) => (
  <StyledTooltip
    align="top"
    justify="middle"
    triggerEvent="hover"
    trigger={
      <IconWrapper>
        <Icon glyph={iconType} fill={color} />
      </IconWrapper>
    }
  >
    {tooltipText}
  </StyledTooltip>
);

// @ts-expect-error
const StyledTooltip = styled(Tooltip)`
  width: 300px;
`;

const IconWrapper = styled.div`
  height: ${size.s};
  margin-left: ${size.xxs};
`;
