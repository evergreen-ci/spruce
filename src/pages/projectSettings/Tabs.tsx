import { useEffect, useMemo, ComponentType } from "react";
import styled from "@emotion/styled";
import { Route, useParams } from "react-router-dom";
import { routes, ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";
import { useProjectSettingsContext } from "./Context";
import { Header } from "./Header";
import { NavigationModal } from "./NavigationModal";
import {
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
} from "./tabs/index";
import { gqlToFormMap } from "./tabs/transformers";
import { readOnlyTabs, TabDataProps } from "./tabs/types";
import { ProjectType } from "./tabs/utils";

type ProjectSettings = ProjectSettingsQuery["projectSettings"];
type RepoSettings = RepoSettingsQuery["repoSettings"];

interface Props {
  projectData?: ProjectSettings;
  projectType: ProjectType;
  repoData?: RepoSettings;
}

export const ProjectSettingsTabs: React.VFC<Props> = ({
  projectData,
  projectType,
  repoData,
}) => {
  const { tab } = useParams<{ tab: ProjectSettingsTabRoutes }>();
  const { setInitialData } = useProjectSettingsContext();

  const projectId = projectData?.projectRef?.id;
  const repoId = repoData?.projectRef?.id;
  const repoBranch = repoData?.projectRef?.branch;
  const identifier = projectData?.projectRef?.identifier;

  const tabData = useMemo(
    () => getTabData(projectData, projectType, repoData),
    [projectData, projectType, repoData]
  );

  useEffect(() => {
    setInitialData(tabData);
  }, [setInitialData, tabData]);

  return (
    <Container>
      <NavigationModal />
      <Header
        id={projectId || repoId}
        isRepo={!projectData}
        projectType={projectType}
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
            projectType={projectType}
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
            projectType={projectType}
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
            projectType={projectType}
            repoData={tabData[ProjectSettingsTabRoutes.Variables].repoData}
          />
        )}
      />
      <Route
        path={routes.projectSettingsGithubCommitQueue}
        render={(props) => (
          <GithubCommitQueueTab
            {...props}
            githubWebhooksEnabled={
              projectData?.githubWebhooksEnabled ||
              repoData?.githubWebhooksEnabled
            }
            projectData={
              tabData[ProjectSettingsTabRoutes.GithubCommitQueue].projectData
            }
            projectType={projectType}
            repoData={
              tabData[ProjectSettingsTabRoutes.GithubCommitQueue].repoData
            }
            versionControlEnabled={
              projectData?.projectRef?.versionControlEnabled ??
              repoData?.projectRef?.versionControlEnabled
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
            projectType={projectType}
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
            projectType={projectType}
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
            projectType={projectType}
            repoData={tabData[ProjectSettingsTabRoutes.PatchAliases].repoData}
          />
        )}
      />
      <Route
        path={routes.projectSettingsVirtualWorkstation}
        render={(props) => (
          <VirtualWorkstationTab
            {...props}
            identifier={identifier || repoBranch}
            projectData={
              tabData[ProjectSettingsTabRoutes.VirtualWorkstation].projectData
            }
            projectType={projectType}
            repoData={
              tabData[ProjectSettingsTabRoutes.VirtualWorkstation].repoData
            }
          />
        )}
      />
      <TabRoute
        Component={ProjectTriggersTab}
        path={routes.projectSettingsProjectTriggers}
        tab={ProjectSettingsTabRoutes.ProjectTriggers}
      />
      <Route
        path={routes.projectSettingsPeriodicBuilds}
        render={(props) => (
          <PeriodicBuildsTab
            {...props}
            projectData={
              tabData[ProjectSettingsTabRoutes.PeriodicBuilds].projectData
            }
            projectType={projectType}
            repoData={tabData[ProjectSettingsTabRoutes.PeriodicBuilds].repoData}
          />
        )}
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

const TabRoute: React.VFC<TabRouteProps> = ({ Component, path, tab }) => (
  <Route path={path} render={(props) => <Component {...props} tab={tab} />} />
);

/* Map data from query to the tab to which it will be passed */
const getTabData = (
  projectData: ProjectSettings,
  projectType: ProjectType,
  repoData?: RepoSettings
): TabDataProps =>
  Object.keys(gqlToFormMap).reduce(
    (obj, tab) => ({
      ...obj,
      [tab]: {
        projectData: gqlToFormMap[tab](projectData, { projectType }),
        repoData: gqlToFormMap[tab](repoData, { projectType }),
      },
    }),
    {} as TabDataProps
  );

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;
