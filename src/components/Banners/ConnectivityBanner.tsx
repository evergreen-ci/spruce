import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { size } from "constants/tokens";
import { useNetworkStatus } from "hooks";
import { Banner } from "./styles";

export const ConnectivityBanner = () => {
  const isOnline = useNetworkStatus();
  return (
    !isOnline && (
      <Banner bannerTheme="warning">
        <IconWithMargin glyph="InfoWithCircle" /> You are Offline
      </Banner>
    )
  );
};

const IconWithMargin = styled(Icon)`
  margin-right: ${size.s};
`;
