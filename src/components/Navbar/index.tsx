import React from "react";
import styled from "@emotion/styled/macro";

export const Navbar: React.FC = () => {
  return (
    <Wrapper>
      <InnerWrapper>logout</InnerWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.nav({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "60px",
  padding: "0 20px"
});

const InnerWrapper = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  height: "100%"
});
