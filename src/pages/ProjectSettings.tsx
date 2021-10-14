import styled from "@emotion/styled";
import { useParams, Link, Redirect } from "react-router-dom";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  PageWrapper,
} from "components/styles";
import {
  ProjectSettingsTabRoutes,
  getProjectSettingsRoute,
} from "constants/routes";
import { ProjectSettingsProvider } from "context/project-settings";
import { usePageTitle } from "hooks";
import { environmentalVariables } from "utils";
import { ProjectSettingsTabs, getTitle } from "./projectSettings/Tabs";

const { isProduction } = environmentalVariables;

const disablePage = isProduction();

export const ProjectSettings: React.FC = () => {
  usePageTitle(`Project Settings`);
  const { id: projectId, tab } = useParams<{ id: string; tab: string }>();
  if (disablePage) {
    return (
      <PageWrapper>
        <PageContainer>
          <h1>Coming Soon 🌱⚙️</h1>
        </PageContainer>
      </PageWrapper>
    );
  }

  if (!tabRouteValues.includes(tab as ProjectSettingsTabRoutes)) {
    return (
      <Redirect
        to={getProjectSettingsRoute(
          projectId,
          ProjectSettingsTabRoutes.General
        )}
      />
    );
  }

  return (
    <ProjectSettingsProvider>
      <SideNav aria-label="Project Settings">
        <SideNavGroup header="Project" />
        <SideNavGroup>
          <ProjectSettingsNavItem
            currentTab={tab}
            tab={ProjectSettingsTabRoutes.General}
            projectId={projectId}
          />
          <ProjectSettingsNavItem
            currentTab={tab}
            tab={ProjectSettingsTabRoutes.Access}
            projectId={projectId}
          />
          <ProjectSettingsNavItem
            currentTab={tab}
            tab={ProjectSettingsTabRoutes.Variables}
            projectId={projectId}
          />
          <ProjectSettingsNavItem
            currentTab={tab}
            tab={ProjectSettingsTabRoutes.GitHubCommitQueue}
            projectId={projectId}
          />
          <ProjectSettingsNavItem
            currentTab={tab}
            tab={ProjectSettingsTabRoutes.Notifications}
            projectId={projectId}
          />
          <ProjectSettingsNavItem
            currentTab={tab}
            tab={ProjectSettingsTabRoutes.PatchAliases}
            projectId={projectId}
          />
          <ProjectSettingsNavItem
            currentTab={tab}
            tab={ProjectSettingsTabRoutes.VirtualWorkstation}
            projectId={projectId}
          />
          <ProjectSettingsNavItem
            currentTab={tab}
            tab={ProjectSettingsTabRoutes.ProjectTriggers}
            projectId={projectId}
          />
          <ProjectSettingsNavItem
            currentTab={tab}
            tab={ProjectSettingsTabRoutes.PeriodicBuilds}
            projectId={projectId}
          />
          <ProjectSettingsNavItem
            currentTab={tab}
            tab={ProjectSettingsTabRoutes.EventLog}
            projectId={projectId}
          />
        </SideNavGroup>
      </SideNav>
      <PageWrapper>
        <ProjectSettingsTabs />
      </PageWrapper>
    </ProjectSettingsProvider>
  );
};

const ProjectSettingsNavItem: React.FC<{
  currentTab: string;
  projectId: string;
  tab: ProjectSettingsTabRoutes;
  title?: string;
}> = ({ currentTab, tab, title, projectId }) => (
  <SideNavItem
    active={tab === currentTab}
    as={Link} // @ts-expect-error
    to={getProjectSettingsRoute(projectId, tab)}
  >
    {title || getTitle(tab).title}
  </SideNavItem>
);

const tabRouteValues = Object.values(ProjectSettingsTabRoutes);

const PageContainer = styled.div`
  display: flex;
`;
