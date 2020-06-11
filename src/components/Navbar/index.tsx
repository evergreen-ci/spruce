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
import { useLegacyUIURL } from "hooks";
import { useNavbarAnalytics } from "analytics";
import { NavDropdown } from "./NavDropdown";

const { Header } = Layout;
const { white, blue, gray } = uiColors;

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuthStateContext();
  const legacyURL = useLegacyUIURL();
  const navbarAnalytics = useNavbarAnalytics();

  if (!isAuthenticated) {
    return null;
  }
  return (
    <StyledHeader>
      <InnerWrapper>
        <Link
          to={routes.myPatches}
          onClick={() => navbarAnalytics.sendEvent({ name: "Click Logo Link" })}
        >
          <Logo>
            <EvergreenLogo />
            <StyledSubtitle>Evergreen</StyledSubtitle>
          </Logo>
        </Link>
        <NavActionContainer>
          {legacyURL && (
            <NavLink
              href={legacyURL}
              data-cy="legacy-ui-link"
              onClick={() =>
                navbarAnalytics.sendEvent({ name: "Click Legacy UI Link" })
              }
            >
              Switch to legacy UI
            </NavLink>
          )}
          <NavDropdown />
        </NavActionContainer>
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

const NavLink = styled(StyledLink)`
  color: ${blue.light2};
  margin-right: 40px;
`;

const NavActionContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
