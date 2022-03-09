import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";
import { useNetworkStatus } from "hooks";

const { yellow } = uiColors;
export const ConnectivityBanner = () => {
  const isOffline = useNetworkStatus();
  return (
    isOffline && (
      <Banner>
        <IconWithMargin glyph="InfoWithCircle" /> You are Offline
      </Banner>
    )
  );
};

const Banner = styled.div`
  transition: max-height 0.3s ease-in-out;
  align-items: center;
  background-color: ${yellow.light3};
  display: flex;
  padding: ${size.xxs} ${size.s};
`;

const IconWithMargin = styled(Icon)`
  margin-right: ${size.s};
`;
