import Icon from "@leafygreen-ui/icon";
import { useParams, Link } from "react-router-dom";
import { usePreferencesAnalytics } from "analytics";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  PageWrapper,
} from "components/styles";
import {
  PreferencesTabRoutes,
  getPreferencesRoute,
  slugs,
} from "constants/routes";
import { usePageTitle } from "hooks";
import { PreferencesTabs } from "pages/preferences/PreferencesTabs";

const Preferences: React.FC = () => {
  usePageTitle("Preferences");
  const { [slugs.tab]: tab } = useParams();
  const { sendEvent } = usePreferencesAnalytics();

  return (
    <>
      <SideNav aria-label="Preferences">
        <SideNavGroup header="Preferences" glyph={<Icon glyph="Settings" />}>
          <SideNavItem
            active={tab === PreferencesTabRoutes.Profile}
            to={getPreferencesRoute(PreferencesTabRoutes.Profile)}
            as={Link}
            data-cy="profile-nav-tab"
            onClick={() =>
              sendEvent({
                name: "Change Tab",
                tab: PreferencesTabRoutes.Profile,
              })
            }
          >
            Profile
          </SideNavItem>
          <SideNavItem
            active={tab === PreferencesTabRoutes.Notifications}
            to={getPreferencesRoute(PreferencesTabRoutes.Notifications)}
            as={Link}
            data-cy="notifications-nav-tab"
            onClick={() =>
              sendEvent({
                name: "Change Tab",
                tab: PreferencesTabRoutes.Notifications,
              })
            }
          >
            Notifications
          </SideNavItem>
          <SideNavItem
            active={tab === PreferencesTabRoutes.CLI}
            to={getPreferencesRoute(PreferencesTabRoutes.CLI)}
            as={Link}
            data-cy="cli-nav-tab"
            onClick={() =>
              sendEvent({
                name: "Change Tab",
                tab: PreferencesTabRoutes.CLI,
              })
            }
          >
            CLI & API
          </SideNavItem>
          <SideNavItem
            active={tab === PreferencesTabRoutes.PublicKeys}
            to={getPreferencesRoute(PreferencesTabRoutes.PublicKeys)}
            as={Link}
            data-cy="publickeys-nav-tab"
            onClick={() =>
              sendEvent({
                name: "Change Tab",
                tab: PreferencesTabRoutes.PublicKeys,
              })
            }
          >
            Public Keys
          </SideNavItem>
          <SideNavItem
            active={tab === PreferencesTabRoutes.NewUI}
            to={getPreferencesRoute(PreferencesTabRoutes.NewUI)}
            as={Link}
            data-cy="newui-nav-tab"
            onClick={() =>
              sendEvent({
                name: "Change Tab",
                tab: PreferencesTabRoutes.NewUI,
              })
            }
          >
            New UI
          </SideNavItem>
        </SideNavGroup>
      </SideNav>
      <PageWrapper>
        <PreferencesTabs />
      </PageWrapper>
    </>
  );
};

export default Preferences;
