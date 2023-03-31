import styled from "@emotion/styled";
import { IconProps } from "@leafygreen-ui/icon";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";

export type IconTooltipProps = IconProps & {
  ["data-cy"]?: string;
  children: React.ReactNode;
};

const IconTooltip: React.VFC<IconTooltipProps> = ({
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
  display: flex;
  align-items: center;
`;

export default IconTooltip;
