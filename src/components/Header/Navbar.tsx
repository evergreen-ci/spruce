import { useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { useNavbarAnalytics } from "analytics";
import Icon from "components/Icon";
import { StyledLink } from "components/styles";
import { getUserPatchesRoute, routes } from "constants/routes";
import { useAuthStateContext } from "context/auth";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { useLegacyUIURL } from "hooks";
import { environmentalVariables } from "utils";
import { AuxiliaryDropdown } from "./AuxiliaryDropdown";
import { UserDropdown } from "./UserDropdown";

const { getUiUrl } = environmentalVariables;

const { white, blue, gray } = uiColors;

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuthStateContext();
  const legacyURL = useLegacyUIURL();
  const uiURL = getUiUrl();
  const navbarAnalytics = useNavbarAnalytics();

  const { data } = useQuery<GetUserQuery>(GET_USER);
  const { user } = data || {};
  const { userId } = user || {};

  if (!isAuthenticated) {
    return null;
  }
  return (
    <StyledNav>
      <NavActionContainer>
        <LogoLink
          to={routes.myPatches}
          onClick={() => navbarAnalytics.sendEvent({ name: "Click Logo Link" })}
        >
          <Icon glyph="EvergreenLogo" />
        </LogoLink>

        <PrimaryA
          href={`${uiURL}/waterfall`}
          onClick={() =>
            navbarAnalytics.sendEvent({ name: "Click Waterfall Link" })
          }
        >
          Waterfall
        </PrimaryA>
        <PrimaryLink to={getUserPatchesRoute(userId)}>My Patches</PrimaryLink>
        <PrimaryLink to={routes.spawnHost}>My Hosts</PrimaryLink>
        <AuxiliaryDropdown />
      </NavActionContainer>
      <NavActionContainer>
        {legacyURL && (
          <SecondaryLink
            href={legacyURL}
            data-cy="legacy-ui-link"
            onClick={() =>
              navbarAnalytics.sendEvent({ name: "Click Legacy UI Link" })
            }
          >
            Switch to legacy UI
          </SecondaryLink>
        )}
        <UserDropdown />
      </NavActionContainer>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  align-items: center;
  background-color: ${gray.dark3};
  display: flex;
  justify-content: space-between;
  height: 64px;
  line-height: 64px;
  padding: 0 36px;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
`;

const NavActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > :not(:last-child) {
    margin-right: 40px;
  }
`;

const primaryStyle = css`
  color: ${white};
`;

const PrimaryLink = styled(Link)`
  ${primaryStyle}
`;

const PrimaryA = styled.a`
  ${primaryStyle}
`;

const secondaryStyle = css`
  color: ${blue.light2};
`;

const SecondaryLink = styled(StyledLink)`
  ${secondaryStyle}
`;
