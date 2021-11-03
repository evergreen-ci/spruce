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
import { getTabTitle } from "./getTabTitle";
import { NavigationModal } from "./NavigationModal";

interface Props {
  data: ProjectSettingsQuery;
}

export const ProjectSettingsTabs: React.FC<Props> = ({ data }) => {
  const { tab } = useParams<{ tab: ProjectSettingsTabRoutes }>();
  const { saveTab } = useProjectSettingsContext();
  const { title, subtitle } = getTabTitle(tab);

  const {
    projectSettings: {
      projectRef: { id, useRepoSettings },
    },
  } = data;

  const tabData = useMemo(() => getTabData(data), [data]);

  return (
    <Container>
      <NavigationModal />
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
            projectId={id}
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
}

const TabRoute: React.FC<TabRouteProps> = ({ Component, path, tab }) => (
  <Route path={path} render={(props) => <Component {...props} tab={tab} />} />
);

/* Map data from query to the tab to which it will be passed */
const getTabData = (
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
        deactivatePrevious,
        dispatchingDisabled,
        repotrackerDisabled,
        defaultLogger,
        validDefaultLoggers,
        cedarTestResultsEnabled,
        patchingDisabled,
        taskSync,
        disabledStatsCache,
        filesIgnoredFromCache,
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
      ...(dispatchingDisabled && { dispatchingDisabled }),
      ...(deactivatePrevious && { deactivatePrevious }),
      ...(repotrackerDisabled && { repotrackerDisabled }),
      ...(defaultLogger && { defaultLogger }),
      validDefaultLoggers,
      ...(cedarTestResultsEnabled && { cedarTestResultsEnabled }),
      ...(patchingDisabled && { patchingDisabled }),
      ...(taskSync && {
        taskSync: {
          configEnabled: taskSync.configEnabled,
          patchEnabled: taskSync.patchEnabled,
        },
      }),
      ...(disabledStatsCache && { disabledStatsCache }),
      ...(filesIgnoredFromCache && { filesIgnoredFromCache }),
    },
  };
};

const Container = styled.div`
  min-width: min-content;
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
