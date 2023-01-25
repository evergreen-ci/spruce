import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Outlet, Route, Routes } from "react-router-dom";
import { useAnalyticsAttributes } from "analytics";
import { Feedback } from "components/Feedback";
import { Header } from "components/Header";
import { FullPageLoad } from "components/Loading/FullPageLoad";
import {
  ProjectSettingsRedirect,
  UserPatchesRedirect,
  WaterfallCommitsRedirect,
} from "components/Redirects";
import { PageGrid } from "components/styles/Layout";
import { TaskStatusIconLegend } from "components/TaskStatusIconLegend";
import WelcomeModal from "components/WelcomeModal";
import { redirectRoutes, routes } from "constants/routes";
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
import { Task } from "pages/Task";
import { TaskHistory } from "pages/TaskHistory";
import { TaskQueue } from "pages/TaskQueue";
import { UserPatches } from "pages/UserPatches";
import { VariantHistory } from "pages/VariantHistory";
import { VersionPage } from "pages/Version";

const Layout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

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
      <Routes>
        <Route element={<Layout />}>
          <Route path="*" element={<PageDoesNotExist />} />
          <Route path="/" element={<MyPatches />} />
          <Route path={routes.commits} element={<Commits />}>
            <Route path=":projectIdentifier" element={null} />
          </Route>
          <Route
            path={redirectRoutes.waterfall}
            element={<WaterfallCommitsRedirect />}
          />
          <Route path={routes.configurePatch} element={<ConfigurePatch />}>
            <Route path={tab} element={null} />
          </Route>
          <Route path={routes.host} element={<Host />} />
          <Route path={routes.hosts} element={<Hosts />} />
          <Route path={routes.jobLogs} element={<JobLogs />}>
            <Route path=":groupId" element={null} />
          </Route>
          <Route path={routes.myPatches} element={<MyPatches />} />
          <Route path={routes.patch} element={<VersionPage />}>
            <Route path={tab} element={null} />
          </Route>
          <Route path={routes.preferences} element={<Preferences />}>
            <Route path={tab} element={null} />
          </Route>
          <Route path={routes.projectPatches} element={<ProjectPatches />} />
          <Route path={routes.projectSettings} element={<ProjectSettings />}>
            <Route path={tab} element={null} />
          </Route>
          <Route
            path={redirectRoutes.projectSettings}
            element={<ProjectSettingsRedirect />}
          />
          <Route path={`${routes.spawn}/*`} element={<Spawn />}>
            <Route path={tab} element={null} />
          </Route>
          <Route path={routes.commitQueue} element={<CommitQueue />} />
          <Route path={routes.task} element={<Task />}>
            <Route path={tab} element={null} />
          </Route>
          <Route path={routes.taskHistory} element={<TaskHistory />} />
          <Route path={routes.taskQueue} element={<TaskQueue />}>
            <Route path=":distro" element={null} />
            <Route path=":distro/:taskId" element={null} />
          </Route>
          <Route path={routes.userPatches} element={<UserPatches />} />
          <Route
            path={redirectRoutes.userPatches}
            element={<UserPatchesRedirect />}
          />
          <Route path={routes.variantHistory} element={<VariantHistory />} />
          <Route path={routes.version} element={<VersionPage />}>
            <Route path={tab} element={null} />
          </Route>
        </Route>
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
