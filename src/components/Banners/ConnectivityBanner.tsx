import React from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import { useNetworkStatus } from "hooks";

const { red } = uiColors;
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
  background-color: ${red.light2};
  display: flex;
  padding: 5px 15px;
  margin-bottom: 15px;
`;

const IconWithMargin = styled(Icon)`
  margin-right: 15px;
`;
