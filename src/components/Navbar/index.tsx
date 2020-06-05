import React from "react";
import styled from "@emotion/styled/macro";
import { useAuthStateContext } from "context/auth";
import { Layout } from "antd";
import { EvergreenLogo } from "components/icons";
import { StyledLink } from "components/styles";
import { Subtitle } from "@leafygreen-ui/typography";
import { uiColors } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { routes } from "constants/routes";
import { useLegacyUIURL } from "hooks/index";

const { Header } = Layout;
const { white, gray } = uiColors;

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuthStateContext();
  const legacyURL = useLegacyUIURL();

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
        {legacyURL && (
          <StyledLink href={legacyURL}>Switch to legacy UI</StyledLink>
        )}
      </InnerWrapper>
    </StyledHeader>
  );
};

const StyledHeader = styled(Header)`
  background-color: ${gray.dark3};
  margin-bottom: 16px;
  padding: 0 36px;
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 100%;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
`;
const StyledSubtitle = styled(Subtitle)`
  color: ${white};
  margin-left: 8px;
`;
