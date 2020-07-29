import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { Task } from "pages/Task";
import { Patch } from "pages/Patch";
import { UserPatches } from "pages/UserPatches";
import { Login } from "pages/Login";
import { CommitQueue } from "pages/CommitQueue";
import { Hosts } from "pages/Hosts";
import { Host } from "pages/Host";
import { PrivateRoute } from "components/PrivateRoute";
import { Navbar } from "components/Navbar";
import { SiteBanner, ConnectivityBanner } from "components/Banners";
import { routes, paths } from "constants/routes";
import { FullPageLoad } from "components/Loading/FullPageLoad";
import { useAuthStateContext } from "context/auth";
import { useQuery } from "@apollo/react-hooks";
import { GET_USER, GET_USER_SETTINGS } from "gql/queries";
import { GetUserQuery, GetUserSettingsQuery } from "gql/generated/types";
import { PageLayout } from "components/styles/Layout";
import { PageDoesNotExist } from "pages/404";
import { ConfigurePatch } from "pages/ConfigurePatch";
import { Preferences } from "pages/Preferences";
import { MyPatches } from "pages/MyPatches";
import get from "lodash/get";
import { PatchRedirect } from "pages/PatchRedirect";
import { UserPatchesRedirect } from "components/UserPatchesRedirect";
import { WelcomeModal } from "components/WelcomeModal";

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
      <Switch>
        <PrivateRoute path={routes.task} component={Task} />
        <PrivateRoute path={routes.configurePatch} component={ConfigurePatch} />
        <PrivateRoute path={routes.patch} component={PatchRedirect} />
        <PrivateRoute path={routes.version} component={Patch} />
        <PrivateRoute path={routes.hosts} component={Hosts} />
        <PrivateRoute path={routes.host} component={Host} />
        <PrivateRoute exact path={routes.myPatches} component={MyPatches} />
        <PrivateRoute path={routes.userPatches} component={UserPatches} />
        <PrivateRoute
          path={`${paths.user}/:id`}
          component={UserPatchesRedirect}
        />
        <PrivateRoute path={routes.commitQueue} component={CommitQueue} />
        <PrivateRoute path={routes.preferences} component={Preferences} />
        <PrivateRoute exact path="/">
          <Redirect to={routes.myPatches} />
        </PrivateRoute>
        <Route path={routes.login} component={Login} />
        <Route component={PageDoesNotExist} />
      </Switch>
      {!hasUsedSpruceBefore && <WelcomeModal />}
    </PageLayout>
  );
};
