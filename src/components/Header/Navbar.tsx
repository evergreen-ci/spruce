import { useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Subtitle } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { useNavbarAnalytics } from "analytics";
import Icon from "components/Icon";
import { StyledLink } from "components/styles";
import { getCommitsRoute, getUserPatchesRoute, routes } from "constants/routes";
import { useAuthStateContext } from "context/auth";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { useLegacyUIURL } from "hooks";
import { AuxiliaryDropdown } from "./AuxiliaryDropdown";
import { UserDropdown } from "./UserDropdown";

const { white, blue, gray } = uiColors;

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuthStateContext();
  const legacyURL = useLegacyUIURL();
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
        <Link
          to={routes.myPatches}
          onClick={() => navbarAnalytics.sendEvent({ name: "Click Logo Link" })}
        >
          <Logo>
            <Icon glyph="EvergreenLogo" />
            {/* @ts-expect-error */}
            <StyledSubtitle>Evergreen</StyledSubtitle>
          </Logo>
        </Link>

        <PrimaryLink
          to={getCommitsRoute()}
          onClick={() =>
            navbarAnalytics.sendEvent({ name: "Click Waterfall Link" })
          }
        >
          Project Health
        </PrimaryLink>
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
const Logo = styled.div`
  display: flex;
  align-items: center;
`;

/* @ts-expect-error */
const StyledSubtitle = styled(Subtitle)`
  color: ${white};
  margin-left: 8px;
`;

const NavActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > :not(:last-child) {
    margin-right: 40px;
  }
`;

const PrimaryLink = styled(Link)`
  color: ${white};
`;

const secondaryStyle = css`
  color: ${blue.light2};
`;

const SecondaryLink = styled(StyledLink)`
  ${secondaryStyle}
`;
