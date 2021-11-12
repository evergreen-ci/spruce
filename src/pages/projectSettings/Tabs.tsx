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
import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";

import { getTabTitle } from "./getTabTitle";
import { NavigationModal } from "./NavigationModal";

interface Props {
  projectData?: ProjectSettingsQuery;
  repoData?: RepoSettingsQuery;
}

export const ProjectSettingsTabs: React.FC<Props> = ({
  projectData,
  repoData,
}) => {
  const { tab } = useParams<{ tab: ProjectSettingsTabRoutes }>();
  const { saveTab } = useProjectSettingsContext();
  const { title, subtitle } = getTabTitle(tab);

  const projectId = projectData?.projectSettings?.projectRef?.id;
  const useRepoSettings =
    projectData?.projectSettings?.projectRef?.useRepoSettings;

  const tabData = useMemo(() => getTabData(projectData, repoData), [
    projectData,
    repoData,
  ]);

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
          Save Changes on Page
        </Button>
        {projectData && useRepoSettings && (
          <Button data-cy="default-to-repo">Default to Repo on Page</Button>
        )}
      </TitleContainer>

      <Route
        path={routes.projectSettingsGeneral}
        render={(props) => (
          <GeneralTab
            {...props}
            projectId={projectId}
            useRepoSettings={useRepoSettings}
            projectData={tabData[ProjectSettingsTabRoutes.General].projectData}
            repoData={tabData[ProjectSettingsTabRoutes.General].repoData}
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
  projectData: ProjectSettingsQuery,
  repoData?: RepoSettingsQuery
): {
  [ProjectSettingsTabRoutes.General]: {
    projectData: GeneralTabProps["projectData"];
    repoData: GeneralTabProps["repoData"];
  };
} => ({
  [ProjectSettingsTabRoutes.General]: {
    projectData: projectData?.projectSettings?.projectRef,
    repoData: repoData?.repoSettings?.projectRef,
  },
});

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
