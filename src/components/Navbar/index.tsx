import React from "react";
import styled from "@emotion/styled/macro";
import { useAuthDispatchContext, useAuthStateContext } from "context/auth";
import { ProjectSelect } from "components/ProjectSelect";

export const Navbar: React.FC = () => {
  const { logout } = useAuthDispatchContext();
  const { isAuthenticated } = useAuthStateContext();

  return (
    <Wrapper>
      <InnerWrapper>
        <ProjectSelect />
        {isAuthenticated && (
          <LogoutButton id="logout" onClick={logout}>
            Logout
          </LogoutButton>
        )}
      </InnerWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  padding: 0 20px;
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`;

const LogoutButton = styled.div`
  cursor: pointer;
`;
