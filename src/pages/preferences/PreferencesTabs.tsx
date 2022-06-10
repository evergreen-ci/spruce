import styled from "@emotion/styled";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { Route, Routes, useParams, Navigate } from "react-router-dom";
import { PreferencesTabRoutes } from "constants/routes";
import { size } from "constants/tokens";
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
      <Routes>
        <Route path={PreferencesTabRoutes.Profile} element={<ProfileTab />} />
        <Route
          path={PreferencesTabRoutes.Notifications}
          element={<NotificationsTab />}
        />
        <Route path={PreferencesTabRoutes.CLI} element={<CliTab />} />
        <Route path={PreferencesTabRoutes.NewUI} element={<NewUITab />} />
        <Route
          path={PreferencesTabRoutes.PublicKeys}
          element={<PublicKeysTab />}
        />
        <Route
          path="*"
          element={<Navigate to={PreferencesTabRoutes.Profile} replace />}
        />
      </Routes>
    </Container>
  );
};

const getTitle = (
  tab: PreferencesTabRoutes = PreferencesTabRoutes.Profile
): { title: string; subtitle?: string } => {
  const defaultTitleAndContent = {
    title: "Profile",
  };
  return (
    {
      [PreferencesTabRoutes.Profile]: defaultTitleAndContent,
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
    }[tab] ?? defaultTitleAndContent
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
