import React from "react";
import styled from "@emotion/styled/macro";
import {
  logout,
  useAuthDispatchContext,
  useAuthStateContext
} from "../../context/auth";

export const Navbar: React.FC = () => {
  const dispatch = useAuthDispatchContext();
  const { isAuthenticated } = useAuthStateContext();

  const logoutHandler = () => {
    logout(dispatch);
  };

  return (
    <Wrapper>
      <InnerWrapper>
        {isAuthenticated && (
          <LogoutButton onClick={logoutHandler}>Logout</LogoutButton>
        )}
      </InnerWrapper>
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

const LogoutButton = styled.div({
  cursor: "pointer"
});
