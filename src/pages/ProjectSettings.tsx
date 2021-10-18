import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
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
import {
  ProjectSettingsQuery,
  ProjectSettingsQueryVariables,
} from "gql/generated/types";
import { GET_PROJECT_SETTINGS } from "gql/queries";
import { usePageTitle } from "hooks";
import { environmentalVariables } from "utils";
import { ProjectSettingsTabs, getTitle } from "./projectSettings/Tabs";

const { isProduction } = environmentalVariables;

const disablePage = isProduction();

export const ProjectSettings: React.FC = () => {
  usePageTitle(`Project Settings`);
  const { identifier, tab } = useParams<{
    identifier: string;
    tab: ProjectSettingsTabRoutes;
  }>();

  const { data } = useQuery<
    ProjectSettingsQuery,
    ProjectSettingsQueryVariables
  >(GET_PROJECT_SETTINGS, {
    variables: { identifier },
  });

  if (disablePage) {
    return (
      <PageWrapper>
        <PageContainer>
          <h1>Coming Soon 🌱⚙️</h1>
        </PageContainer>
      </PageWrapper>
    );
  }

  if (!tabRouteValues.includes(tab)) {
    return (
      <Redirect
        to={getProjectSettingsRoute(
          identifier,
          ProjectSettingsTabRoutes.General
        )}
      />
    );
  }

  const sharedProps = {
    identifier,
    currentTab: tab,
  };

  return (
    <ProjectSettingsProvider>
      <SideNav aria-label="Project Settings">
        <SideNavGroup header="Project" />
        <SideNavGroup>
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.General}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.Access}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.Variables}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.GitHubCommitQueue}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.Notifications}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.PatchAliases}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.VirtualWorkstation}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.ProjectTriggers}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.PeriodicBuilds}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.EventLog}
          />
        </SideNavGroup>
      </SideNav>
      <PageWrapper>
        {data ? <ProjectSettingsTabs data={data} /> : <Skeleton />}
      </PageWrapper>
    </ProjectSettingsProvider>
  );
};

const ProjectSettingsNavItem: React.FC<{
  currentTab: ProjectSettingsTabRoutes;
  identifier: string;
  tab: ProjectSettingsTabRoutes;
  title?: string;
}> = ({ currentTab, identifier, tab, title }) => (
  <SideNavItem
    active={tab === currentTab}
    as={Link} // @ts-expect-error
    to={getProjectSettingsRoute(identifier, tab)}
  >
    {title || getTitle(tab).title}
  </SideNavItem>
);

const tabRouteValues = Object.values(ProjectSettingsTabRoutes);

const PageContainer = styled.div`
  display: flex;
`;
