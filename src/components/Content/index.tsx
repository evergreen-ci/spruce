import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { Task } from "pages/Task";
import { Patch } from "pages/Patch";
import { MyPatches } from "pages/MyPatches";
import { Login } from "pages/Login";
import { CommitQueue } from "pages/CommitQueue";
import { PrivateRoute } from "components/PrivateRoute";
import { Navbar } from "components/Navbar";
import { routes } from "constants/routes";
import { FullPageLoad } from "components/Loading/FullPageLoad";
import { useAuthStateContext } from "context/auth";
import { useQuery } from "@apollo/react-hooks";
import { GET_PROJECTS } from "gql/queries/get-projects";
import { ProjectsQuery } from "gql/generated/types";
import { PageLayout } from "components/styles/Layout";
import { PageDoesNotExist } from "pages/404";
import { ConfigurePatch } from "pages/ConfigurePatch";
import { Banners } from "components/Banners";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";

export const Content = () => {
  const { isAuthenticated, initialLoad } = useAuthStateContext();

  // this top-level query is required for authentication to work
  // afterware is used at apollo link level to authenticate or deauthenticate user based on response to query
  // therefore this could be any query as long as it is top-level
  const { data, loading } = useQuery<ProjectsQuery>(GET_PROJECTS);

  if (!isAuthenticated && initialLoad) {
    return <FullPageLoad />;
  }
  return (
    <PageLayout>
      <Navbar data={data} loading={loading} />
      <BannersWithContext />
      <Switch>
        <PrivateRoute path={routes.task} component={Task} />
        <PrivateRoute path={routes.configurePatch} component={ConfigurePatch} />
        <PrivateRoute path={routes.patch} component={Patch} />
        <PrivateRoute path={routes.myPatches} component={MyPatches} />
        <PrivateRoute path={routes.commitQueue} component={CommitQueue} />
        <PrivateRoute exact={true} path="/">
          <Redirect to={routes.myPatches} />
        </PrivateRoute>
        <Route path={routes.login} component={Login} />
        <Route component={PageDoesNotExist} />
      </Switch>
    </PageLayout>
  );
};

const BannersWithContext = () => {
  const bannersState = useBannerStateContext();
  const banner = useBannerDispatchContext();
  return <Banners banners={bannersState} removeBanner={banner.remove} />;
};
