import styled from "@emotion/styled";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { routes, PreferencesTabRoutes } from "constants/routes";
import { size } from "constants/tokens";
import { Route, useParams } from "react-router-dom";
import { CliTab } from "./preferencesTabs/CliTab";
import { NewUITab } from "./preferencesTabs/NewUITab";
import { NotificationsTab } from "./preferencesTabs/NotificationsTab";
import { ProfileTab } from "./preferencesTabs/ProfileTab";
import { PublicKeysTab } from "./preferencesTabs/PublicKeysTab";

export const PreferencesTabs: React.VFC = () => {
  const { tab } = useParams<{ tab: string }>();

  const { title, subtitle } = getTitle(tab as PreferencesTabRoutes);

  return (
    <Container>
      <TitleContainer>
        <H2 data-cy="preferences-tab-title">{title}</H2>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleContainer>

      <Route path={routes.profilePreferences} component={ProfileTab} />
      <Route
        path={routes.notificationsPreferences}
        component={NotificationsTab}
      />
      <Route path={routes.cliPreferences} component={CliTab} />
      <Route path={routes.newUIPreferences} component={NewUITab} />
      <Route path={routes.publicKeysPreferences} component={PublicKeysTab} />
    </Container>
  );
};

const getTitle = (
  tab: PreferencesTabRoutes = PreferencesTabRoutes.Profile
): { title: string; subtitle?: string } => {
  const defaultTitle = {
    title: "Profile",
  };
  return (
    {
      [PreferencesTabRoutes.Profile]: defaultTitle,
      [PreferencesTabRoutes.Notifications]: {
        title: "Notifications",
      },
      [PreferencesTabRoutes.CLI]: {
        title: "CLI & API",
      },
      [PreferencesTabRoutes.NewUI]: {
        title: "New UI Settings",
      },
      [PreferencesTabRoutes.PublicKeys]: {
        title: "Manage Public Keys",
        subtitle: "These keys will be used to SSH into spawned hosts",
      },
    }[tab] ?? defaultTitle
  );
};

const Container = styled.div`
  width: 60%;
`;

const TitleContainer = styled.div`
  margin-bottom: 30px;
`;

const Subtitle = styled(Disclaimer)`
  padding-top: ${size.s};
`;
