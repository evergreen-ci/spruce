import React from "react";
import { useQuery } from "@apollo/client";
import get from "lodash/get";
import { Route, Redirect, Switch } from "react-router-dom";
import {
  SiteBanner,
  ConnectivityBanner,
  SlackNotificationBanner,
} from "components/Banners";
import { Feedback } from "components/Feedback";
import { FullPageLoad } from "components/Loading/FullPageLoad";
import { Navbar } from "components/Navbar";
import { PrivateRoute } from "components/PrivateRoute";
import { PageLayout } from "components/styles/Layout";
import { UserPatchesRedirect } from "components/UserPatchesRedirect";
import { WelcomeModal } from "components/WelcomeModal";
import { routes, paths } from "constants/routes";
import { useAuthStateContext } from "context/auth";
import { GetUserQuery, GetUserSettingsQuery } from "gql/generated/types";
import { GET_USER, GET_USER_SETTINGS } from "gql/queries";
import { PageDoesNotExist } from "pages/404";
import { CommitQueue } from "pages/CommitQueue";
import { ConfigurePatch } from "pages/ConfigurePatch";
import { Host } from "pages/Host";
import { Hosts } from "pages/Hosts";
import { Login } from "pages/Login";
import { MyPatches } from "pages/MyPatches";
import { Patch } from "pages/Patch";
import { PatchRedirect } from "pages/PatchRedirect";
import { Preferences } from "pages/Preferences";
import { Spawn } from "pages/Spawn";
import { Task } from "pages/Task";
import { TaskQueue } from "pages/TaskQueue";
import { UserPatches } from "pages/UserPatches";

export const Content: React.FC = () => {
  const { isAuthenticated, initialLoad } = useAuthStateContext();

  // this top-level query is required for authentication to work
  // afterware is used at apollo link level to authenticate or deauthenticate user based on response to query
  // therefore this could be any query as long as it is top-level
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const { data: userSettingsData } = useQuery<GetUserSettingsQuery>(
    GET_USER_SETTINGS
  );

  localStorage.setItem("userId", get(data, "user.userId", ""));

  const hasUsedSpruceBefore = get(
    userSettingsData,
    "userSettings.useSpruceOptions.hasUsedSpruceBefore",
    true
  );

  if (!isAuthenticated && initialLoad) {
    return <FullPageLoad />;
  }
  return (
    <PageLayout>
      <Navbar />
      <ConnectivityBanner />
      <SiteBanner />
      <SlackNotificationBanner />
      <Switch>
        <PrivateRoute path={routes.task} component={Task} />
        <PrivateRoute path={routes.configurePatch} component={ConfigurePatch} />
        <PrivateRoute path={routes.patch} component={PatchRedirect} />
        <PrivateRoute path={routes.version} component={Patch} />
        <PrivateRoute path={routes.hosts} component={Hosts} />
        <PrivateRoute path={routes.host} component={Host} />
        <PrivateRoute exact path={routes.myPatches} component={MyPatches} />
        <PrivateRoute path={routes.userPatches} component={UserPatches} />
        <PrivateRoute path={routes.taskQueue} component={TaskQueue} />
        <PrivateRoute
          path={`${paths.user}/:id`}
          component={UserPatchesRedirect}
        />
        <PrivateRoute path={routes.spawn} component={Spawn} />
        <PrivateRoute path={routes.commitQueue} component={CommitQueue} />
        <PrivateRoute path={routes.preferences} component={Preferences} />
        <PrivateRoute exact path="/">
          <Redirect to={routes.myPatches} />
        </PrivateRoute>
        <Route path={routes.login} component={Login} />
        <Route component={PageDoesNotExist} />
      </Switch>
      {!hasUsedSpruceBefore && <WelcomeModal />}
      <Feedback />
    </PageLayout>
  );
};
