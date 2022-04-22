import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { size } from "constants/tokens";

interface IconTooltipProps extends React.ComponentProps<typeof Icon> {
  tooltipText: string;
  ["data-cy"]?: string;
}

export const IconTooltip: React.VFC<IconTooltipProps> = ({
  tooltipText,
  "data-cy": dataCy,
  ...rest
}) => (
  <StyledTooltip
    align="top"
    justify="middle"
    triggerEvent="hover"
    trigger={
      <IconWrapper data-cy={dataCy}>
        <StyledIcon {...rest} />
      </IconWrapper>
    }
  >
    {tooltipText}
  </StyledTooltip>
);

// @ts-expect-error
const StyledTooltip = styled(Tooltip)`
  max-width: 300px;
`;

const IconWrapper = styled.div`
  height: ${size.s};
  margin-left: ${size.xxs};
`;

const StyledIcon = styled(Icon)`
  display: block;
`;
