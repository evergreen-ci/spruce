import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";

const { red } = uiColors;
export const ConnectivityBanner = () => {
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    window.addEventListener("offline", () => setConnected(false));
    window.addEventListener("online", () => {
      setConnected(true);
      window.location.reload();
    });
    return () => {
      window.removeEventListener("offline", () => undefined);
      window.removeEventListener("online", () => undefined);
    };
  });
  return (
    !connected && (
      <Banner>
        <IconWithMargin glyph="InfoWithCircle" /> You have lost connection to
        the Evergreen servers!
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
