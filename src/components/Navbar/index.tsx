import React from "react";
import styled from "@emotion/styled/macro";
import { useAuthStateContext } from "context/auth";
import { Layout } from "antd";
import { EvergreenLogo } from "components/icons";
import { Subtitle } from "@leafygreen-ui/typography";
import { uiColors } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { routes } from "constants/routes";

const { Header } = Layout;

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuthStateContext();
  if (!isAuthenticated) {
    return null;
  }

  return (
    <StyledHeader>
      <InnerWrapper>
        <Link to={routes.myPatches}>
          <Logo>
            <EvergreenLogo />
            <StyledSubtitle>Evergreen</StyledSubtitle>
          </Logo>
        </Link>
      </InnerWrapper>
    </StyledHeader>
  );
};

const StyledHeader = styled(Header)`
  background-color: ${uiColors.gray.dark3};
  margin-bottom: 16px;
  padding: 0 36px;
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
`;
const StyledSubtitle = styled(Subtitle)`
  color: ${uiColors.white};
  margin-left: 8px;
`;
