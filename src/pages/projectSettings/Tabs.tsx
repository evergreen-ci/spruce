import { ComponentType } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { Route, useParams } from "react-router-dom";
import { Button } from "components/Button";
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
} from "components/ProjectSettingsTabs";
import { TabProps } from "components/ProjectSettingsTabs/utils";
import { routes, ProjectSettingsTabRoutes } from "constants/routes";
import { useProjectSettingsContext } from "context/project-settings";
import {
  ProjectSettingsUseRepoQuery,
  ProjectSettingsUseRepoQueryVariables,
} from "gql/generated/types";
import { GET_PROJECT_SETTINGS_USE_REPO } from "gql/queries";

export const ProjectSettingsTabs: React.FC = () => {
  const { identifier, tab } = useParams<{
    identifier: string;
    tab: ProjectSettingsTabRoutes;
  }>();
  const { saveTab } = useProjectSettingsContext();

  const { title, subtitle } = getTitle(tab);

  const { data } = useQuery<
    ProjectSettingsUseRepoQuery,
    ProjectSettingsUseRepoQueryVariables
  >(GET_PROJECT_SETTINGS_USE_REPO, {
    variables: { identifier },
    fetchPolicy: "cache-and-network",
  });

  const useRepoSettings = data?.projectSettings?.projectRef?.useRepoSettings;

  return (
    <Container>
      <TitleContainer>
        <H2 data-cy="project-settings-tab-title">{title}</H2>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        <Button
          variant="primary"
          onClick={() => {
            saveTab(tab);
          }}
        >
          Save changes on page
        </Button>
        {!useRepoSettings && <Button>Default to Repo on page</Button>}
      </TitleContainer>

      <TabRoute
        Component={GeneralTab}
        path={routes.projectSettingsGeneral}
        tab={ProjectSettingsTabRoutes.General}
        useRepoSettings={useRepoSettings}
      />
      <TabRoute
        Component={AccessTab}
        path={routes.projectSettingsAccess}
        tab={ProjectSettingsTabRoutes.Access}
      />
      <TabRoute
        Component={VariablesTab}
        path={routes.projectSettingsVariables}
        tab={ProjectSettingsTabRoutes.Variables}
      />
      <TabRoute
        Component={GitHubCommitQueueTab}
        path={routes.projectSettingsGitHubCommitQueue}
        tab={ProjectSettingsTabRoutes.GitHubCommitQueue}
      />
      <TabRoute
        Component={NotificationsTab}
        path={routes.projectSettingsNotifications}
        tab={ProjectSettingsTabRoutes.Notifications}
      />
      <TabRoute
        Component={PatchAliasesTab}
        path={routes.projectSettingsPatchAliases}
        tab={ProjectSettingsTabRoutes.PatchAliases}
      />
      <TabRoute
        Component={VirtualWorkstationTab}
        path={routes.projectSettingsVirtualWorkstation}
        tab={ProjectSettingsTabRoutes.VirtualWorkstation}
      />
      <TabRoute
        Component={ProjectTriggersTab}
        path={routes.projectSettingsProjectTriggers}
        tab={ProjectSettingsTabRoutes.ProjectTriggers}
      />
      <TabRoute
        Component={PeriodicBuildsTab}
        path={routes.projectSettingsPeriodicBuilds}
        tab={ProjectSettingsTabRoutes.PeriodicBuilds}
      />
      <TabRoute
        Component={EventLogTab}
        path={routes.projectSettingsEventLog}
        tab={ProjectSettingsTabRoutes.EventLog}
      />
    </Container>
  );
};

interface TabRouteProps {
  Component: ComponentType<TabProps>;
  path: string;
  tab: ProjectSettingsTabRoutes;
  useRepoSettings?: boolean;
}

const TabRoute: React.FC<TabRouteProps> = ({
  Component,
  path,
  tab,
  useRepoSettings = false,
}) => (
  <Route
    path={path}
    render={(props) => (
      <Component {...props} tab={tab} useRepoSettings={useRepoSettings} />
    )}
  />
);

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
  width: 60%;
`;

const TitleContainer = styled.div`
  display: flex;
  margin-bottom: 30px;

  > :not(:last-child) {
    margin-right: 24px;
  }
`;

const Subtitle = styled(Disclaimer)`
  padding-top: 16px;
`;
