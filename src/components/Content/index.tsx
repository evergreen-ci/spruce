import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import get from "lodash/get";
import { Route, Switch } from "react-router-dom";
import { useAnalyticsAttributes } from "analytics";
import { Feedback } from "components/Feedback";
import { Header } from "components/Header";
import { FullPageLoad } from "components/Loading/FullPageLoad";
import { ProjectSettingsRedirect } from "components/ProjectSettingsRedirect";
import { PageGrid } from "components/styles/Layout";
import { TaskStatusIconLegend } from "components/TaskStatusIconLegend";
import { UserPatchesRedirect } from "components/UserPatchesRedirect";
import { WelcomeModal } from "components/WelcomeModal";
import { routes } from "constants/routes";
import { zIndex, size } from "constants/tokens";
import { useAuthStateContext } from "context/auth";
import { GetUserQuery, GetUserSettingsQuery } from "gql/generated/types";
import { GET_USER, GET_USER_SETTINGS } from "gql/queries";
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

export const Content: React.FC = () => {
  const { isAuthenticated } = useAuthStateContext();

  // this top-level query is required for authentication to work
  // afterware is used at apollo link level to authenticate or deauthenticate user based on response to query
  // therefore this could be any query as long as it is top-level
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const { data: userSettingsData } = useQuery<GetUserSettingsQuery>(
    GET_USER_SETTINGS
  );
  const hasUsedSpruceBefore =
    userSettingsData?.userSettings?.useSpruceOptions?.hasUsedSpruceBefore ===
    false;
  localStorage.setItem("userId", get(data, "user.userId", ""));

  useAnalyticsAttributes();

  useAnnouncementToast();

  if (!isAuthenticated) {
    return <FullPageLoad />;
  }

  return (
    <PageGrid>
      <Header />
      <Switch>
        <Route path={routes.task} component={Task} />
        <Route path={routes.configurePatch} component={ConfigurePatch} />
        <Route exact path={routes.patch} component={VersionPage} />
        <Route path={routes.version} component={VersionPage} />
        <Route path={routes.jobLogs} component={JobLogs} />
        <Route path={routes.hosts} component={Hosts} />
        <Route path={routes.host} component={Host} />
        <Route path={routes.myPatches} component={MyPatches} />
        <Route
          exact
          path={routes.userPatchesRedirect}
          component={UserPatchesRedirect}
        />
        <Route
          path={routes.projectSettingsRedirect}
          component={ProjectSettingsRedirect}
        />
        <Route path={routes.userPatches} component={UserPatches} />
        <Route path={routes.taskQueue} component={TaskQueue} />
        <Route path={routes.projectPatches} component={ProjectPatches} />
        <Route path={routes.projectSettings} component={ProjectSettings} />
        <Route path={routes.spawn} component={Spawn} />
        <Route path={routes.commitQueue} component={CommitQueue} />
        <Route path={routes.preferences} component={Preferences} />
        <Route path={routes.commits} component={Commits} />
        <Route path={routes.taskHistory} component={TaskHistory} />
        <Route path={routes.variantHistory} component={VariantHistory} />
        <Route exact path="/" component={MyPatches} />

        <Route component={PageDoesNotExist} />
      </Switch>
      {hasUsedSpruceBefore && <WelcomeModal />}
      <FloatingContent>
        <TaskStatusIconLegend />
        <Feedback />
      </FloatingContent>
    </PageGrid>
  );
};

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
