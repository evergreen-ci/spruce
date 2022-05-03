import { useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { useNavbarAnalytics } from "analytics";
import Icon from "components/Icon";
import { StyledLink } from "components/styles";
import { wikiUrl } from "constants/externalResources";
import { getCommitsRoute, getUserPatchesRoute, routes } from "constants/routes";
import { size } from "constants/tokens";
import { useAuthStateContext } from "context/auth";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { useLegacyUIURL } from "hooks";
import { Link } from "react-router-dom";
import { environmentalVariables } from "utils";
import { AuxiliaryDropdown } from "./AuxiliaryDropdown";
import { UserDropdown } from "./UserDropdown";

const { getUiUrl, isBeta } = environmentalVariables;

const { white, blue, gray } = uiColors;

export const Navbar: React.VFC = () => {
  const { isAuthenticated } = useAuthStateContext();
  const legacyURL = useLegacyUIURL();
  const { sendEvent } = useNavbarAnalytics();
  const uiURL = getUiUrl();

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
          onClick={() => sendEvent({ name: "Click Logo Link" })}
        >
          <Icon glyph="EvergreenLogo" />
        </LogoLink>

        {isBeta() ? (
          <PrimaryLink
            to={getCommitsRoute()}
            onClick={() => sendEvent({ name: "Click Waterfall Link" })}
          >
            Project Health
          </PrimaryLink>
        ) : (
          <PrimaryA
            href={`${uiURL}/waterfall`}
            onClick={() => sendEvent({ name: "Click Legacy Waterfall Link" })}
          >
            Waterfall
          </PrimaryA>
        )}
        <PrimaryLink
          to={getUserPatchesRoute(userId)}
          onClick={() => sendEvent({ name: "Click My Patches Link" })}
        >
          My Patches
        </PrimaryLink>
        <PrimaryLink
          to={routes.spawnHost}
          onClick={() => sendEvent({ name: "Click My Hosts Link" })}
        >
          My Hosts
        </PrimaryLink>
        <AuxiliaryDropdown />
      </NavActionContainer>
      <NavActionContainer>
        {legacyURL && (
          <SecondaryLink
            href={legacyURL}
            data-cy="legacy-ui-link"
            onClick={() => sendEvent({ name: "Click Legacy UI Link" })}
          >
            Switch to Legacy UI
          </SecondaryLink>
        )}
        <PrimaryAWithIcon
          href={wikiUrl}
          target="_blank"
          onClick={() => sendEvent({ name: "Click EVG Wiki Link" })}
        >
          <Icon glyph="QuestionMarkWithCircle" />
          Documentation
        </PrimaryAWithIcon>
        <UserDropdown />
      </NavActionContainer>
    </StyledNav>
  );
};

export const navBarHeight = size.xl;
const StyledNav = styled.nav`
  align-items: center;
  background-color: ${gray.dark3};
  display: flex;
  justify-content: space-between;
  height: ${navBarHeight};
  line-height: ${navBarHeight};
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

const primaryLinkStyle = css`
  color: ${white};
`;

const PrimaryLink = styled(Link)`
  ${primaryLinkStyle}
`;

const PrimaryA = styled.a`
  ${primaryLinkStyle}
`;

const PrimaryAWithIcon = styled(PrimaryA)`
  display: flex;
  align-items: center;
  > svg {
    margin-right: ${size.xxs};
  }
`;

const secondaryStyle = css`
  color: ${blue.light2};
`;

const SecondaryLink = styled(StyledLink)`
  ${secondaryStyle}
`;
