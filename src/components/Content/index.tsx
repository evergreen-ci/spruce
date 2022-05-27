import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAnalyticsAttributes } from "analytics";
import { Feedback } from "components/Feedback";
import { Header } from "components/Header";
import { FullPageLoad } from "components/Loading/FullPageLoad";
import { ProjectSettingsRedirect } from "components/ProjectSettingsRedirect";
import { PageGrid } from "components/styles/Layout";
import { TaskStatusIconLegend } from "components/TaskStatusIconLegend";
import { UserPatchesRedirect } from "components/UserPatchesRedirect";
import WelcomeModal from "components/WelcomeModal";
import { baseRoute, routes, SpawnTab } from "constants/routes";
import { zIndex, size } from "constants/tokens";
import { newSpruceUser } from "constants/welcomeModalProps";
import { useAuthStateContext } from "context/auth";
import { GetUserQuery, GetUserQueryVariables } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { useUserSettings } from "hooks";
import { useAnnouncementToast } from "hooks/useAnnouncementToast";
import { PageDoesNotExist } from "pages/404";
import { CommitQueue } from "pages/CommitQueue";
import { Commits } from "pages/Commits";
import { ConfigurePatch } from "pages/ConfigurePatch";
import { Host } from "pages/Host";
import { Hosts } from "pages/Hosts";
import { JobLogs } from "pages/JobLogs";
import { MyPatches } from "pages/MyPatches";
import { Preferences } from "pages/Preferences";
import { ProjectPatches } from "pages/ProjectPatches";
import { ProjectSettings } from "pages/ProjectSettings";
import { Spawn } from "pages/Spawn";
import { SpawnHost } from "pages/spawn/SpawnHost";
import { SpawnVolume } from "pages/spawn/SpawnVolume";
import { Task } from "pages/Task";
import { TaskHistory } from "pages/TaskHistory";
import { TaskQueue } from "pages/TaskQueue";
import { UserPatches } from "pages/UserPatches";
import { VariantHistory } from "pages/VariantHistory";
import { VersionPage } from "pages/Version";

export const Content: React.VFC = () => {
  const { isAuthenticated } = useAuthStateContext();

  // this top-level query is required for authentication to work
  // afterware is used at apollo link level to authenticate or deauthenticate user based on response to query
  // therefore this could be any query as long as it is top-level
  const { data } = useQuery<GetUserQuery, GetUserQueryVariables>(GET_USER);
  localStorage.setItem("userId", data?.user?.userId ?? "");
  const { userSettings } = useUserSettings();

  const { useSpruceOptions } = userSettings ?? {};
  const { hasUsedSpruceBefore = true } = useSpruceOptions ?? {};

  useAnalyticsAttributes();

  useAnnouncementToast();

  if (!isAuthenticated) {
    return <FullPageLoad />;
  }

  return (
    <PageGrid>
      <Header />
      <Routes>
        <Route path={baseRoute.task}>
          <Route path={tab} element={<Task />} />
          <Route path="" element={<Task />} />
        </Route>
        <Route path={baseRoute.configurePatch} element={<ConfigurePatch />}>
          <Route path={tab} element={<ConfigurePatch />} />
          <Route path="" element={<ConfigurePatch />} />
        </Route>
        <Route path={routes.patch}>
          <Route path={tab} element={<VersionPage />} />
          <Route path="" element={<VersionPage />} />
        </Route>
        <Route path={baseRoute.version}>
          <Route path={tab} element={<VersionPage />} />
          <Route path="" element={<VersionPage />} />
        </Route>
        <Route path={routes.jobLogs}>
          <Route path=":groupId" element={<JobLogs />} />
          <Route path="" element={<JobLogs />} />
        </Route>
        <Route path={routes.hosts} element={<Hosts />} />
        <Route path={routes.host} element={<Host />} />
        <Route path={routes.myPatches} element={<MyPatches />} />
        <Route
          path={routes.userPatchesRedirect}
          element={<UserPatchesRedirect />}
        />
        <Route
          path={routes.projectSettingsRedirect}
          element={<ProjectSettingsRedirect />}
        />
        <Route path={routes.userPatches} element={<UserPatches />} />
        <Route path={routes.taskQueue}>
          <Route path="" element={<TaskQueue />} />
          <Route path=":distro" element={<TaskQueue />} />
          <Route path=":distro/:taskId" element={<TaskQueue />} />
        </Route>
        <Route path={routes.projectPatches} element={<ProjectPatches />} />
        <Route path={baseRoute.projectSettings}>
          <Route path={tab} element={<ProjectSettings />} />
          <Route path="" element={<ProjectSettings />} />
        </Route>
        <Route path={routes.spawn} element={<Spawn />}>
          <Route path={SpawnTab.Host} element={<SpawnHost />} />
          <Route path={SpawnTab.Volume} element={<SpawnVolume />} />
          <Route path="" element={<Navigate to={SpawnTab.Host} replace />} />
        </Route>
        <Route path={routes.commitQueue} element={<CommitQueue />} />
        <Route path={routes.preferences}>
          <Route path={tab} element={<Preferences />} />
          <Route path="" element={<Preferences />} />
        </Route>
        <Route path={baseRoute.commits}>
          <Route path=":id" element={<Commits />} />
          <Route path="" element={<Commits />} />
        </Route>
        <Route path={routes.taskHistory} element={<TaskHistory />} />
        <Route path={routes.variantHistory} element={<VariantHistory />} />
        <Route path="/" element={<MyPatches />} />
        <Route path="*" element={<PageDoesNotExist />} />
      </Routes>
      {!hasUsedSpruceBefore && (
        <WelcomeModal
          title="Welcome to the New Evergreen UI!"
          param="hasUsedSpruceBefore"
          carouselCards={newSpruceUser}
        />
      )}
      <FloatingContent>
        <TaskStatusIconLegend />
        <Feedback />
      </FloatingContent>
    </PageGrid>
  );
};

const tab = ":tab";
const FloatingContent = styled.div`
  position: fixed;
  z-index: ${zIndex.tooltip};
  bottom: 0;
  right: 0;
  margin-left: ${size.l};
  margin-bottom: ${size.s};
  background-color: white;
  padding: ${size.xs};
  border-radius: ${size.s};
`;
