import React from "react";
import styled from "@emotion/styled/macro";
import { useAuthDispatchContext, useAuthStateContext } from "context/auth";
import { ProjectSelect } from "components/ProjectSelect";
import { Layout } from "antd";

const { Header } = Layout;

export const Navbar: React.FC = () => {
  const { logout } = useAuthDispatchContext();
  const { isAuthenticated } = useAuthStateContext();

  return (
    <Header style={{ background: "#20313c" }}>
      <InnerWrapper>
        <ProjectSelect />
        {isAuthenticated && (
          <LogoutButton id="logout" onClick={logout}>
            Logout
          </LogoutButton>
        )}
      </InnerWrapper>
    </Header>
  );
};

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`;

const LogoutButton = styled.div`
  cursor: pointer;
`;
