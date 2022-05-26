import { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";
import { useProjectSettingsContext } from "./Context";
import { Header } from "./Header";
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

  const getContent = (t: string): JSX.Element => {
    switch (t) {
      case ProjectSettingsTabRoutes.General:
        return (
          <GeneralTab
            projectId={projectId}
            projectData={tabData[ProjectSettingsTabRoutes.General].projectData}
            projectType={projectType}
            repoData={tabData[ProjectSettingsTabRoutes.General].repoData}
            validDefaultLoggers={
              projectData?.projectRef?.validDefaultLoggers ||
              repoData?.projectRef?.validDefaultLoggers
            }
          />
        );
      case ProjectSettingsTabRoutes.Access:
        return (
          <AccessTab
            projectData={tabData[ProjectSettingsTabRoutes.Access].projectData}
            projectType={projectType}
            repoData={tabData[ProjectSettingsTabRoutes.Access].repoData}
          />
        );
      case ProjectSettingsTabRoutes.Variables:
        return (
          <VariablesTab
            projectData={
              tabData[ProjectSettingsTabRoutes.Variables].projectData
            }
            projectType={projectType}
            repoData={tabData[ProjectSettingsTabRoutes.Variables].repoData}
          />
        );
      case ProjectSettingsTabRoutes.GithubCommitQueue:
        return (
          <GithubCommitQueueTab
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
        );
      case ProjectSettingsTabRoutes.Plugins:
        return (
          <PluginsTab
            projectData={tabData[ProjectSettingsTabRoutes.Plugins].projectData}
            projectType={projectType}
            repoData={tabData[ProjectSettingsTabRoutes.Plugins].repoData}
          />
        );
      case ProjectSettingsTabRoutes.Notifications:
        return (
          <NotificationsTab
            id={projectId || repoData?.projectRef?.id}
            projectData={
              tabData[ProjectSettingsTabRoutes.Notifications].projectData
            }
            projectType={projectType}
            repoData={tabData[ProjectSettingsTabRoutes.Notifications].repoData}
          />
        );
      case ProjectSettingsTabRoutes.PatchAliases:
        return (
          <PatchAliasesTab
            projectData={
              tabData[ProjectSettingsTabRoutes.PatchAliases].projectData
            }
            projectType={projectType}
            repoData={tabData[ProjectSettingsTabRoutes.PatchAliases].repoData}
          />
        );
      case ProjectSettingsTabRoutes.VirtualWorkstation:
        return (
          <VirtualWorkstationTab
            identifier={identifier || repoBranch}
            projectData={
              tabData[ProjectSettingsTabRoutes.VirtualWorkstation].projectData
            }
            projectType={projectType}
            repoData={
              tabData[ProjectSettingsTabRoutes.VirtualWorkstation].repoData
            }
          />
        );
      case ProjectSettingsTabRoutes.ProjectTriggers:
        return (
          <ProjectTriggersTab
            projectData={
              tabData[ProjectSettingsTabRoutes.ProjectTriggers].projectData
            }
            projectType={projectType}
            repoData={
              tabData[ProjectSettingsTabRoutes.ProjectTriggers].repoData
            }
          />
        );
      case ProjectSettingsTabRoutes.PeriodicBuilds:
        return (
          <PeriodicBuildsTab
            projectData={
              tabData[ProjectSettingsTabRoutes.PeriodicBuilds].projectData
            }
            projectType={projectType}
            repoData={tabData[ProjectSettingsTabRoutes.PeriodicBuilds].repoData}
          />
        );
      case ProjectSettingsTabRoutes.EventLog:
        return <EventLogTab projectType={projectType} />;
      default:
        <></>;
    }
  };
  return (
    <Container>
      <Header
        id={projectId || repoId}
        isRepo={!projectData}
        projectType={projectType}
        saveable={!(readOnlyTabs as ReadonlyArray<string>).includes(tab)}
        tab={tab}
      />
      {getContent(tab)}
    </Container>
  );
};

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
