import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import { useNavbarAnalytics } from "analytics";
import Icon from "components/Icon";
import { CURRENT_PROJECT } from "constants/cookies";
import { wikiUrl } from "constants/externalResources";
import { getCommitsRoute, getUserPatchesRoute, routes } from "constants/routes";
import { size } from "constants/tokens";
import { useAuthStateContext } from "context/auth";
import { UserQuery, SpruceConfigQuery } from "gql/generated/types";
import { GET_USER, GET_SPRUCE_CONFIG } from "gql/queries";
import { useLegacyUIURL } from "hooks";
import { AuxiliaryDropdown } from "./AuxiliaryDropdown";
import { UserDropdown } from "./UserDropdown";

const { white, blue, gray } = palette;

export const Navbar: React.VFC = () => {
  const { isAuthenticated } = useAuthStateContext();
  const legacyURL = useLegacyUIURL();
  const { sendEvent } = useNavbarAnalytics();

  const { data: userData } = useQuery<UserQuery>(GET_USER);
  const { user } = userData || {};
  const { userId } = user || {};

  const { projectIdentifier: projectFromUrl } = useParams<{
    projectIdentifier: string;
  }>();

  // Update current project cookie if the project in the URL does not equal the cookie value.
  // This will inform future navigations to the /commits page.
  useEffect(() => {
    if (projectFromUrl && projectFromUrl !== Cookies.get(CURRENT_PROJECT)) {
      Cookies.set(CURRENT_PROJECT, projectFromUrl);
    }
  }, [projectFromUrl]);

  const currProject = projectFromUrl ?? Cookies.get(CURRENT_PROJECT);

  const { data: configData } = useQuery<SpruceConfigQuery>(GET_SPRUCE_CONFIG, {
    skip: currProject !== undefined,
  });

  const projectIdentifier =
    currProject || configData?.spruceConfig?.ui?.defaultProject;

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
          <Icon glyph="EvergreenLogo" size={32} />
        </LogoLink>
        <PrimaryLink
          data-cy="project-health-link"
          to={getCommitsRoute(projectIdentifier)}
          onClick={() => sendEvent({ name: "Click Waterfall Link" })}
        >
          Project Health
        </PrimaryLink>

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
        <AuxiliaryDropdown projectIdentifier={projectIdentifier} />
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${size.xxl};
  background-color: ${gray.dark3};
  height: ${navBarHeight};
  line-height: ${navBarHeight};
  padding: 0 ${size.l};
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
`;

const NavActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${size.l};
`;

const primaryLinkStyle = css`
  color: ${white};
  transition: all 100ms ease-in;
  flex-shrink: 0;

  :hover {
    color: ${blue.light1};
  }
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
  transition: all 100ms ease-in;
  flex-shrink: 0;

  :hover {
    color: ${blue.light1};
  }
`;

const SecondaryLink = styled.a`
  ${secondaryStyle}
`;
