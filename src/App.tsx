import * as React from "react";
import bugsnag from "@bugsnag/browser";
import bugsnagReact from "@bugsnag/plugin-react";
import GQLWrapper from "utils/gql/GQLWrapper";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import {
  getBugsnagApiKey,
  getGQLUrl,
  getSchemaString,
  isDevelopment,
  isTest,
  shouldEnableGQLMockServer
} from "./utils/getEnvironmentVariables";
import { Task } from "pages/Task";
import { Patch } from "pages/Patch";
import { MyPatches } from "pages/MyPatches";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./components/PrivateRoute";
import { ContextProviders } from "./context/Providers";
import { Navbar } from "./components/Navbar";
import "antd/dist/antd.css";
import { routes } from "./contants/routes";
import { Layout } from "antd";

const bugsnagClient = bugsnag(getBugsnagApiKey());
bugsnagClient.use(bugsnagReact, React);
const ErrorBoundary = bugsnagClient.getPlugin("react");

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ContextProviders>
        <Router>
          <GQLWrapper
            gqlURL={getGQLUrl()}
            isDevelopment={isDevelopment()}
            isTest={isTest()}
            schemaString={getSchemaString()}
            credentials="include"
            shouldEnableGQLMockServer={shouldEnableGQLMockServer()}
          >
            <Layout>
              <Navbar />
              <PrivateRoute path={routes.task} component={Task} />
              <PrivateRoute path={routes.patch} component={Patch} />
              <PrivateRoute path={routes.myPatches} component={MyPatches} />
              <PrivateRoute exact={true} path="/">
                <Redirect to={routes.myPatches} />
              </PrivateRoute>
              <Route path={routes.login} component={Login} />
            </Layout>
          </GQLWrapper>
        </Router>
      </ContextProviders>
    </ErrorBoundary>
  );
};

export default App;
