import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon, { glyphs } from "components/Icon";
import { size } from "constants/tokens";

const { black } = uiColors;

interface IconTooltipProps {
  tooltipText: string;
  iconType: keyof typeof glyphs;
  color?: string;
}

export const IconTooltip: React.FC<IconTooltipProps> = ({
  tooltipText,
  iconType,
  color = black,
}) => (
  <StyledTooltip
    align="top"
    justify="middle"
    triggerEvent="hover"
    trigger={
      <IconWrapper>
        <StyledIcon glyph={iconType} fill={color} />
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

const StyledIcon = styled(Icon)`
  display: block;
`;
