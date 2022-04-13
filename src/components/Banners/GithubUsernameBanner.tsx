import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { Body } from "@leafygreen-ui/typography";
import { StyledRouterLink } from "components/styles";
import { getPreferencesRoute, PreferencesTabRoutes } from "constants/routes";
import { size } from "constants/tokens";
import { GetUserSettingsQuery } from "gql/generated/types";
import { GET_USER_SETTINGS } from "gql/queries";
import { Banner } from "./styles";

export const GithubUsernameBanner = () => {
  // USER SETTINGS QUERY
  const { data: userSettingsData } = useQuery<GetUserSettingsQuery>(
    GET_USER_SETTINGS
  );
  const { userSettings } = userSettingsData || {};
  const { githubUser } = userSettings || {};
  const { lastKnownAs } = githubUser || {};
  const hasNoGithubUser = lastKnownAs === "";

  return (
    hasNoGithubUser && (
      <Banner data-cy="github-username-banner" bannerTheme="warning">
        <IconWithMargin glyph="InfoWithCircle" />
        <Body>
          Please set your GitHub username on the{" "}
          <StyledRouterLink
            to={getPreferencesRoute(PreferencesTabRoutes.Profile)}
          >
            settings page
          </StyledRouterLink>
          . Evergreen uses this to map GitHub pull requests to your Evergreen
          user account.
        </Body>
      </Banner>
    )
  );
};

const IconWithMargin = styled(Icon)`
  margin-right: ${size.s};
`;
