import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Task } from "pages/Task";
import { Patch } from "pages/Patch";
import { MyPatches } from "pages/MyPatches";
import { Login } from "pages/Login";
import { PrivateRoute } from "components/PrivateRoute";
import { Navbar } from "components/Navbar";
import { routes } from "contants/routes";
import { Layout } from "antd";
import { FullPageLoad } from "components/Loading/FullPageLoad";
import { useAuthStateContext } from "context/auth";
import { useQuery } from "@apollo/react-hooks";
import { GET_PROJECTS, ProjectsQuery } from "graphql/queries/get-projects";

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
    <Layout>
      <Navbar data={data} loading={loading} />
      <PrivateRoute path={routes.task} component={Task} />
      <PrivateRoute path={routes.patch} component={Patch} />
      <PrivateRoute path={routes.myPatches} component={MyPatches} />
      <PrivateRoute exact={true} path="/">
        <Redirect to={routes.myPatches} />
      </PrivateRoute>
      <Route path={routes.login} component={Login} />
    </Layout>
  );
};
