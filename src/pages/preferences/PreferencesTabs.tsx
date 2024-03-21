import styled from "@emotion/styled";
import { Body, BodyProps, H2 } from "@leafygreen-ui/typography";
import { Route, Routes, useParams, Navigate } from "react-router-dom";
import {
  PreferencesTabRoutes,
  getPreferencesRoute,
  slugs,
} from "constants/routes";
import { size } from "constants/tokens";
import { CliTab } from "./preferencesTabs/CliTab";
import { NewUITab } from "./preferencesTabs/NewUITab";
import { NotificationsTab } from "./preferencesTabs/NotificationsTab";
import { ProfileTab } from "./preferencesTabs/ProfileTab";
import { PublicKeysTab } from "./preferencesTabs/PublicKeysTab";

export const PreferencesTabs: React.FC = () => {
  const { [slugs.tab]: tab } = useParams();

  const { subtitle, title } = getTitle(tab as PreferencesTabRoutes);
  return (
    <>
      <TitleContainer>
        <H2 data-cy="preferences-tab-title">{title}</H2>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleContainer>
      <Routes>
        <Route
          path={PreferencesTabRoutes.Profile}
          element={
            <Container>
              <ProfileTab />
            </Container>
          }
        />
        <Route
          path={PreferencesTabRoutes.Notifications}
          element={
            <WideContainer>
              <NotificationsTab />
            </WideContainer>
          }
        />
        <Route
          path={PreferencesTabRoutes.CLI}
          element={
            <Container>
              <CliTab />
            </Container>
          }
        />
        <Route
          path={PreferencesTabRoutes.NewUI}
          element={
            <Container>
              <NewUITab />
            </Container>
          }
        />
        <Route
          path={PreferencesTabRoutes.PublicKeys}
          element={
            <Container>
              <PublicKeysTab />
            </Container>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={getPreferencesRoute(PreferencesTabRoutes.Profile)}
              replace
            />
          }
        />
      </Routes>
    </>
  );
};

const getTitle = (
  tab: PreferencesTabRoutes = PreferencesTabRoutes.Profile,
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
        subtitle: "These keys will be used to SSH into spawned hosts.",
      },
    }[tab] ?? defaultTitle
  );
};

const Container = styled.main`
  min-width: 600px;
  width: 60%;
`;

const WideContainer = styled.main`
  min-width: 600px;
  width: 90%;
`;

const TitleContainer = styled.div`
  margin-bottom: 30px;
`;

const Subtitle = styled(Body)<BodyProps>`
  padding-top: ${size.s};
`;
