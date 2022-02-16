import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { useParams, Link, Redirect } from "react-router-dom";
import { ProjectSettingsProvider } from "components/ProjectSettingsTabs/Context";
import { CreateProjectModal } from "components/ProjectSettingsTabs/CreateProjectModal";
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
import { useToastContext } from "context/toast";
import {
  ProjectSettingsQuery,
  ProjectSettingsQueryVariables,
  RepoSettingsQuery,
  RepoSettingsQueryVariables,
} from "gql/generated/types";
import { GET_PROJECT_SETTINGS, GET_REPO_SETTINGS } from "gql/queries";
import { usePageTitle } from "hooks";
import { environmentalVariables, validators } from "utils";
import { getTabTitle } from "./projectSettings/getTabTitle";
import { ProjectSettingsTabs } from "./projectSettings/Tabs";

const { isProduction } = environmentalVariables;
const { validateObjectId } = validators;

const disablePage = isProduction();

export const ProjectSettings: React.FC = () => {
  usePageTitle(`Project Settings`);
  const dispatchToast = useToastContext();
  const { identifier, tab } = useParams<{
    identifier: string;
    tab: ProjectSettingsTabRoutes;
  }>();

  // If the path includes an Object ID, this page represents a repo and we should not attempt to fetch a project.
  const isRepo = validateObjectId(identifier);

  const { data: projectData, loading: projectLoading } = useQuery<
    ProjectSettingsQuery,
    ProjectSettingsQueryVariables
  >(GET_PROJECT_SETTINGS, {
    skip: isRepo,
    variables: { identifier },
    onError: (e) => {
      dispatchToast.error(
        `There was an error loading the project ${identifier}: ${e.message}`
      );
    },
  });

  const repoRefId =
    projectData?.projectSettings?.projectRef?.repoRefId || identifier;
  const useRepoSettings =
    projectData?.projectSettings?.projectRef?.useRepoSettings;

  const { data: repoData } = useQuery<
    RepoSettingsQuery,
    RepoSettingsQueryVariables
  >(GET_REPO_SETTINGS, {
    skip: projectLoading || useRepoSettings === false,
    variables: { repoId: repoRefId },
    onError: (e) => {
      dispatchToast.error(
        `There was an error loading the repo ${repoRefId}: ${e.message}`
      );
    },
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

  const project =
    projectData !== null
      ? projectData?.projectSettings
      : repoData?.repoSettings;
  const hasData = projectData ? !useRepoSettings || repoData : repoData;

  return (
    <ProjectSettingsProvider>
      <SideNav aria-label="Project Settings">
        <SideNavGroup header="Project" />
        <CreateProjectModal project={project} />
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
            tab={ProjectSettingsTabRoutes.GithubCommitQueue}
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
            tab={ProjectSettingsTabRoutes.Plugins}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.EventLog}
          />
        </SideNavGroup>
      </SideNav>
      <PageWrapper>
        {hasData ? (
          <ProjectSettingsTabs
            projectData={projectData?.projectSettings}
            repoData={repoData?.repoSettings}
          />
        ) : (
          <Skeleton />
        )}
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
    data-cy={`navitem-${tab}`}
  >
    {title || getTabTitle(tab).title}
  </SideNavItem>
);

const tabRouteValues = Object.values(ProjectSettingsTabRoutes);

const PageContainer = styled.div`
  display: flex;
`;
