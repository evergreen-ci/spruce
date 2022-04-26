import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { size } from "constants/tokens";

interface IconTooltipProps extends React.ComponentProps<typeof Icon> {
  ["data-cy"]?: string;
}

const IconTooltip: React.FC<IconTooltipProps> = ({
  children,
  "data-cy": dataCy,
  ...rest
}) => (
  <StyledTooltip
    align="top"
    justify="middle"
    triggerEvent="hover"
    trigger={
      <IconWrapper data-cy={dataCy}>
        <Icon {...rest} />
      </IconWrapper>
    }
  >
    {children}
  </StyledTooltip>
);

// @ts-expect-error
const StyledTooltip = styled(Tooltip)`
  max-width: 300px;
`;

const IconWrapper = styled.div`
  margin-left: ${size.xxs};
  display: flex;
  align-items: center;
`;

export default IconTooltip;
