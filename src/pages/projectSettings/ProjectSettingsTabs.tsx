import styled from "@emotion/styled";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { Route, useParams } from "react-router-dom";
import { routes, ProjectSettingsTabRoutes } from "constants/routes";
import {
  AccessTab,
  EventLogTab,
  GeneralTab,
  GitHubCommitQueueTab,
  NotificationsTab,
  PatchAliasesTab,
  PeriodicBuildsTab,
  ProjectTriggersTab,
  VariablesTab,
  VirtualWorkstationTab,
} from "./projectSettingsTabs/index";

export const ProjectSettingsTabs: React.FC = () => {
  const { tab } = useParams<{ tab: string }>();

  const { title, subtitle } = getTitle(tab as ProjectSettingsTabRoutes);

  return (
    <Container>
      <TitleContainer>
        <H2 data-cy="project-settings-tab-title">{title}</H2>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleContainer>

      <Route path={routes.projectSettingsGeneral} component={GeneralTab} />
      <Route path={routes.projectSettingsAccess} component={AccessTab} />
      <Route path={routes.projectSettingsVariables} component={VariablesTab} />
      <Route
        path={routes.projectSettingsGitHubCommitQueue}
        component={GitHubCommitQueueTab}
      />
      <Route
        path={routes.projectSettingsNotifications}
        component={NotificationsTab}
      />
      <Route
        path={routes.projectSettingsPatchAliases}
        component={PatchAliasesTab}
      />
      <Route
        path={routes.projectSettingsVirtualWorkstation}
        component={VirtualWorkstationTab}
      />
      <Route
        path={routes.projectSettingsProjectTriggers}
        component={ProjectTriggersTab}
      />
      <Route
        path={routes.projectSettingsPeriodicBuilds}
        component={PeriodicBuildsTab}
      />
      <Route path={routes.projectSettingsEventLog} component={EventLogTab} />
    </Container>
  );
};

export const getTitle = (
  tab: ProjectSettingsTabRoutes = ProjectSettingsTabRoutes.General
): { title: string; subtitle?: string } => {
  const defaultTitle = {
    title: "General Settings",
  };
  return (
    {
      [ProjectSettingsTabRoutes.General]: defaultTitle,
      [ProjectSettingsTabRoutes.Access]: {
        title: "Access Settings & Admin",
      },
      [ProjectSettingsTabRoutes.Variables]: {
        title: "Variables",
      },
      [ProjectSettingsTabRoutes.GitHubCommitQueue]: {
        title: "GitHub & Commit Queue",
      },
      [ProjectSettingsTabRoutes.Notifications]: {
        title: "Notifications",
      },
      [ProjectSettingsTabRoutes.PatchAliases]: {
        title: "Patch Aliases",
      },
      [ProjectSettingsTabRoutes.VirtualWorkstation]: {
        title: "Virtual Workstation",
      },
      [ProjectSettingsTabRoutes.ProjectTriggers]: {
        title: "Project Triggers",
      },
      [ProjectSettingsTabRoutes.PeriodicBuilds]: {
        title: "Periodic Builds",
      },
      [ProjectSettingsTabRoutes.EventLog]: {
        title: "Event Log",
      },
    }[tab] ?? defaultTitle
  );
};

const Container = styled.div`
  margin-left: 64px;
  width: 60%;
`;

const TitleContainer = styled.div`
  margin-bottom: 30px;
`;

const Subtitle = styled(Disclaimer)`
  padding-top: 16px;
`;
