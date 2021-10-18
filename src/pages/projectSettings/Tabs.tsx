import { useMemo, ComponentType } from "react";
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
import { GeneralTabProps } from "components/ProjectSettingsTabs/types";
import { TabProps } from "components/ProjectSettingsTabs/utils";
import { routes, ProjectSettingsTabRoutes } from "constants/routes";
import { useProjectSettingsContext } from "context/project-settings";
import { ProjectSettingsQuery } from "gql/generated/types";

interface Props {
  data: ProjectSettingsQuery;
}

export const ProjectSettingsTabs: React.FC<Props> = ({ data }) => {
  const { tab } = useParams<{
    tab: ProjectSettingsTabRoutes;
  }>();
  const { saveTab } = useProjectSettingsContext();

  const { title, subtitle } = getTitle(tab);

  const {
    projectSettings: {
      projectRef: { useRepoSettings },
    },
  } = data;

  const tabData = useMemo(() => makeTabData(data), [data]);

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

      <Route
        path={routes.projectSettingsGeneral}
        render={(props) => (
          <GeneralTab
            {...props}
            useRepoSettings={useRepoSettings}
            data={tabData[ProjectSettingsTabRoutes.General]}
          />
        )}
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

const makeTabData = (
  data: ProjectSettingsQuery
): {
  [ProjectSettingsTabRoutes.General]: GeneralTabProps["data"];
} => {
  const {
    projectSettings: {
      projectRef: {
        batchTime,
        branch,
        displayName,
        enabled,
        owner,
        remotePath,
        repo,
        spawnHostScriptPath,
      },
    },
  } = data;
  return {
    [ProjectSettingsTabRoutes.General]: {
      ...(enabled && { enabled }),
      ...(batchTime && { batchTime }),
      branch,
      displayName,
      owner,
      remotePath,
      repo,
      spawnHostScriptPath,
    },
  };
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
