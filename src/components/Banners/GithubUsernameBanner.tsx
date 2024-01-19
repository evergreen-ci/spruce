import { useQuery } from "@apollo/client";
import Banner from "@leafygreen-ui/banner";
import { matchPath, useLocation } from "react-router-dom";
import { StyledRouterLink } from "components/styles";
import {
  getPreferencesRoute,
  PreferencesTabRoutes,
  routes,
} from "constants/routes";
import { UserSettingsQuery } from "gql/generated/types";
import { USER_SETTINGS } from "gql/queries";

export const GithubUsernameBanner = () => {
  const { pathname } = useLocation();
  const matchedPath = matchPath(routes.user, pathname);
  const isPatchesPage = !!matchedPath;

  // USER SETTINGS QUERY
  const { data: userSettingsData } = useQuery<UserSettingsQuery>(
    USER_SETTINGS,
    { skip: !isPatchesPage },
  );
  const { userSettings } = userSettingsData || {};
  const { githubUser } = userSettings || {};
  const { lastKnownAs } = githubUser || {};
  const hasNoGithubUser = lastKnownAs === "";

  return isPatchesPage && hasNoGithubUser ? (
    <Banner data-cy="github-username-banner" variant="warning">
      Please set your GitHub username on the{" "}
      <StyledRouterLink to={getPreferencesRoute(PreferencesTabRoutes.Profile)}>
        settings page
      </StyledRouterLink>
      . Evergreen uses this to map GitHub pull requests to your Evergreen user
      account.
    </Banner>
  ) : null;
};
