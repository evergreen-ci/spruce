import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import { useLocation } from "react-router-dom";
import { paths } from "constants/routes";
import { size } from "constants/tokens";
import { GetUserSettingsQuery } from "gql/generated/types";
import { GET_USER_SETTINGS } from "gql/queries";

const { green } = uiColors;
export const GithubUsernameBanner = () => {
  const { pathname } = useLocation();
  const isPatchesPage = pathname.startsWith(paths.user);

  // USER SETTINGS QUERY
  const { data: userSettingsData } = useQuery<GetUserSettingsQuery>(
    GET_USER_SETTINGS
  );
  const { userSettings } = userSettingsData || {};
  const { githubUser } = userSettings || {};
  const { lastKnownAs } = githubUser || {};
  const hasNoGithubUser = lastKnownAs === "";

  return (
    isPatchesPage &&
    hasNoGithubUser && (
      <Banner data-cy="github-username-banner">
        <IconWithMargin glyph="InfoWithCircle" />
        Please set your GitHub username on the settings page. Evergreen uses
        this to map GitHub pull requests to your Evergreen user account.
      </Banner>
    )
  );
};

const Banner = styled.div`
  transition: max-height 0.3s ease-in-out;
  align-items: center;
  background-color: ${green.light2};
  display: flex;
  padding: ${size.xxs} ${size.s};
`;

const IconWithMargin = styled(Icon)`
  margin-right: ${size.s};
`;
