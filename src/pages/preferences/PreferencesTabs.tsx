import styled from "@emotion/styled";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { PreferencesTabRoutes } from "constants/routes";
import { size } from "constants/tokens";
import { CliTab } from "./preferencesTabs/CliTab";
import { NewUITab } from "./preferencesTabs/NewUITab";
import { NotificationsTab } from "./preferencesTabs/NotificationsTab";
import { ProfileTab } from "./preferencesTabs/ProfileTab";
import { PublicKeysTab } from "./preferencesTabs/PublicKeysTab";

export const PreferencesTabs: React.VFC = () => {
  const { tab } = useParams<{ tab: string }>();

  const { title, subtitle, content } = getTitleAndContent(
    tab as PreferencesTabRoutes
  );

  return (
    <Container>
      <TitleContainer>
        <H2 data-cy="preferences-tab-title">{title}</H2>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleContainer>
      {content}
    </Container>
  );
};

const getTitleAndContent = (
  tab: PreferencesTabRoutes = PreferencesTabRoutes.Profile
): { title: string; subtitle?: string; content: JSX.Element } => {
  const defaultTitleAndContent = {
    title: "Profile",
    content: <ProfileTab />,
  };
  return (
    {
      [PreferencesTabRoutes.Profile]: defaultTitleAndContent,
      [PreferencesTabRoutes.Notifications]: {
        title: "Notifications",
        content: <NotificationsTab />,
      },
      [PreferencesTabRoutes.CLI]: {
        title: "CLI & API",
        content: <CliTab />,
      },
      [PreferencesTabRoutes.NewUI]: {
        title: "New UI Settings",
        content: <NewUITab />,
      },
      [PreferencesTabRoutes.PublicKeys]: {
        title: "Manage Public Keys",
        subtitle: "These keys will be used to SSH into spawned hosts",
        content: <PublicKeysTab />,
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
