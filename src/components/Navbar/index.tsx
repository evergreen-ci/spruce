import React from "react";
import styled from "@emotion/styled/macro";
import { uiColors } from "@leafygreen-ui/palette";
import { Subtitle } from "@leafygreen-ui/typography";
import { Layout } from "antd";
import { Link } from "react-router-dom";
import { useNavbarAnalytics } from "analytics";
import Icon from "components/Icons";
import { StyledLink } from "components/styles";
import { routes } from "constants/routes";
import { useAuthStateContext } from "context/auth";
import { useLegacyUIURL } from "hooks";
import { environmentalVariables } from "utils";
import { NavDropdown } from "./NavDropdown";

const { getUiUrl } = environmentalVariables;

const { Header } = Layout;
const { white, blue, gray } = uiColors;

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuthStateContext();
  const legacyURL = useLegacyUIURL();
  const uiURL = getUiUrl();
  const navbarAnalytics = useNavbarAnalytics();
  if (!isAuthenticated) {
    return null;
  }
  return (
    <StyledHeader>
      <InnerWrapper>
        <NavActionContainer>
          <Link
            to={routes.myPatches}
            onClick={() =>
              navbarAnalytics.sendEvent({ name: "Click Logo Link" })
            }
          >
            <Logo>
              <Icon glyph="EvergreenLogo" />
              {/* @ts-expect-error */}
              <StyledSubtitle>Evergreen</StyledSubtitle>
            </Logo>
          </Link>

          <NavTitle
            href={`${uiURL}/waterfall`}
            onClick={() =>
              navbarAnalytics.sendEvent({ name: "Click Waterfall Link" })
            }
          >
            Waterfall
          </NavTitle>
        </NavActionContainer>
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

/* @ts-expect-error */
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
  align-items: center;
`;

const NavTitle = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${white};
  margin-left: 40px;
`;
