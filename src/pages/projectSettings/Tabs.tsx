import { useMemo, ComponentType } from "react";
import styled from "@emotion/styled";
import { Route, useParams } from "react-router-dom";
import {
  Header,
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
import { gqlToFormMap } from "components/ProjectSettingsTabs/transformers";
import {
  readOnlyTabs,
  TabDataProps,
} from "components/ProjectSettingsTabs/types";
import { TabProps } from "components/ProjectSettingsTabs/utils";
import { routes, ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";
import { NavigationModal } from "./NavigationModal";

type ProjectSettings = ProjectSettingsQuery["projectSettings"];
type RepoSettings = RepoSettingsQuery["repoSettings"];

interface Props {
  projectData?: ProjectSettings;
  repoData?: RepoSettings;
}

export const ProjectSettingsTabs: React.FC<Props> = ({
  projectData,
  repoData,
}) => {
  const { tab } = useParams<{ tab: ProjectSettingsTabRoutes }>();

  const projectId = projectData?.projectRef?.id;
  const useRepoSettings = projectData?.projectRef?.useRepoSettings;

  const tabData = useMemo(() => getTabData(projectData, repoData), [
    projectData,
    repoData,
  ]);

  return (
    <Container>
      <NavigationModal />
      <Header
        id={projectId || repoData?.projectRef?.id}
        isRepo={!projectData}
        saveable={!(readOnlyTabs as ReadonlyArray<string>).includes(tab)}
        tab={tab}
        useRepoSettings={useRepoSettings}
      />
      <Route
        path={routes.projectSettingsGeneral}
        render={(props) => (
          <GeneralTab
            {...props}
            projectId={projectId}
            projectData={tabData[ProjectSettingsTabRoutes.General].projectData}
            repoData={tabData[ProjectSettingsTabRoutes.General].repoData}
            useRepoSettings={useRepoSettings}
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
            useRepoSettings={useRepoSettings}
            projectData={tabData[ProjectSettingsTabRoutes.Access].projectData}
            repoData={tabData[ProjectSettingsTabRoutes.Access].repoData}
          />
        )}
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
  projectData: ProjectSettings,
  repoData?: RepoSettings
): TabDataProps =>
  Object.keys(gqlToFormMap).reduce(
    (obj, tab) => ({
      ...obj,
      [tab]: {
        projectData: gqlToFormMap[tab](projectData),
        repoData: gqlToFormMap[tab](repoData),
      },
    }),
    {} as TabDataProps
  );

const Container = styled.div`
  min-width: min-content;
  width: 60%;
`;
