import { useMemo, ComponentType } from "react";
import styled from "@emotion/styled";
import { Route, useParams } from "react-router-dom";
import {
  Header,
  AccessTab,
  EventLogTab,
  GeneralTab,
  GithubCommitQueueTab,
  NotificationsTab,
  PatchAliasesTab,
  PeriodicBuildsTab,
  ProjectTriggersTab,
  VariablesTab,
  PluginsTab,
  VirtualWorkstationTab,
} from "components/ProjectSettingsTabs";
import { gqlToFormMap } from "components/ProjectSettingsTabs/transformers";
import {
  readOnlyTabs,
  TabDataProps,
} from "components/ProjectSettingsTabs/types";
import { ProjectVariant } from "components/ProjectSettingsTabs/utils";

import { routes, ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";
import { NavigationModal } from "./NavigationModal";

type ProjectSettings = ProjectSettingsQuery["projectSettings"];
type RepoSettings = RepoSettingsQuery["repoSettings"];

interface Props {
  projectData?: ProjectSettings;
  projectVariant: ProjectVariant;
  repoData?: RepoSettings;
}

export const ProjectSettingsTabs: React.FC<Props> = ({
  projectData,
  projectVariant,
  repoData,
}) => {
  const { tab } = useParams<{ tab: ProjectSettingsTabRoutes }>();

  const projectId = projectData?.projectRef?.id;

  const tabData = useMemo(
    () => getTabData(projectData, projectVariant, repoData),
    [projectData, projectVariant, repoData]
  );

  return (
    <Container>
      <NavigationModal />
      <Header
        id={projectId || repoData?.projectRef?.id}
        isRepo={!projectData}
        projectVariant={projectVariant}
        saveable={!(readOnlyTabs as ReadonlyArray<string>).includes(tab)}
        tab={tab}
      />
      <Route
        path={routes.projectSettingsGeneral}
        render={(props) => (
          <GeneralTab
            {...props}
            projectId={projectId}
            projectData={tabData[ProjectSettingsTabRoutes.General].projectData}
            projectVariant={projectVariant}
            repoData={tabData[ProjectSettingsTabRoutes.General].repoData}
            validDefaultLoggers={
              projectData?.projectRef?.validDefaultLoggers ||
              repoData?.projectRef?.validDefaultLoggers
            }
          />
        )}
      />
      <Route
        path={routes.projectSettingsAccess}
        render={(props) => (
          <AccessTab
            {...props}
            projectData={tabData[ProjectSettingsTabRoutes.Access].projectData}
            projectVariant={projectVariant}
            repoData={tabData[ProjectSettingsTabRoutes.Access].repoData}
          />
        )}
      />
      <Route
        path={routes.projectSettingsVariables}
        render={(props) => (
          <VariablesTab
            {...props}
            projectData={
              tabData[ProjectSettingsTabRoutes.Variables].projectData
            }
            projectVariant={projectVariant}
            repoData={tabData[ProjectSettingsTabRoutes.Variables].repoData}
          />
        )}
      />
      <Route
        path={routes.projectSettingsGithubCommitQueue}
        render={(props) => (
          <GithubCommitQueueTab
            {...props}
            gitHubWebhooksEnabled={
              projectData?.gitHubWebhooksEnabled ||
              repoData?.gitHubWebhooksEnabled
            }
            projectData={
              tabData[ProjectSettingsTabRoutes.GithubCommitQueue].projectData
            }
            projectVariant={projectVariant}
            repoData={
              tabData[ProjectSettingsTabRoutes.GithubCommitQueue].repoData
            }
          />
        )}
      />
      <Route
        path={routes.projectSettingsPlugins}
        render={(props) => (
          <PluginsTab
            {...props}
            projectData={tabData[ProjectSettingsTabRoutes.Plugins].projectData}
            projectVariant={projectVariant}
            repoData={tabData[ProjectSettingsTabRoutes.Plugins].repoData}
          />
        )}
      />
      <Route
        path={routes.projectSettingsNotifications}
        render={(props) => (
          <NotificationsTab
            {...props}
            id={projectId || repoData?.projectRef?.id}
            projectData={
              tabData[ProjectSettingsTabRoutes.Notifications].projectData
            }
            projectVariant={projectVariant}
            repoData={tabData[ProjectSettingsTabRoutes.Notifications].repoData}
          />
        )}
      />
      <Route
        path={routes.projectSettingsPatchAliases}
        render={(props) => (
          <PatchAliasesTab
            {...props}
            projectData={
              tabData[ProjectSettingsTabRoutes.PatchAliases].projectData
            }
            projectVariant={projectVariant}
            repoData={tabData[ProjectSettingsTabRoutes.PatchAliases].repoData}
          />
        )}
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
  Component: ComponentType<any>;
  path: string;
  tab: ProjectSettingsTabRoutes;
}

const TabRoute: React.FC<TabRouteProps> = ({ Component, path, tab }) => (
  <Route path={path} render={(props) => <Component {...props} tab={tab} />} />
);

/* Map data from query to the tab to which it will be passed */
const getTabData = (
  projectData: ProjectSettings,
  projectVariant: ProjectVariant,
  repoData?: RepoSettings
): TabDataProps =>
  Object.keys(gqlToFormMap).reduce(
    (obj, tab) => ({
      ...obj,
      [tab]: {
        projectData: gqlToFormMap[tab](projectData, { projectVariant }),
        repoData: gqlToFormMap[tab](repoData, { projectVariant }),
      },
    }),
    {} as TabDataProps
  );

const Container = styled.div`
  min-width: min-content;
  width: 60%;
`;
