import * as React from "react";
import bugsnag from "@bugsnag/browser";
import bugsnagReact from "@bugsnag/plugin-react";
import GQLWrapper from "utils/gql/GQLWrapper";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
  getBugsnagApiKey,
  getGQLUrl,
  getSchemaString,
  isDevelopment,
  isTest,
  shouldEnableGQLMockServer
} from "./utils/getEnvironmentVariables";
import TaskPage from "pages/Task";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./components/PrivateRoute";
import { ContextProviders } from "./context/Providers";
import { Navbar } from "./components/Navbar";

const bugsnagClient = bugsnag(getBugsnagApiKey());
bugsnagClient.use(bugsnagReact, React);
const ErrorBoundary = bugsnagClient.getPlugin("react");

// DELETE ME ONCE THERE ARE OTHER PRIVATE ROUTES
const FakePrivateRoute = () => <div>I am private</div>;

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
            <Navbar />
            <Route path="/login" component={Login} />
            <Route exact path="/task/:taskID" component={TaskPage} />
            <PrivateRoute exact={true} path="/" component={Home} />
            <PrivateRoute path="/private" component={FakePrivateRoute} />
          </GQLWrapper>
        </Router>
      </ContextProviders>
    </ErrorBoundary>
  );
};

export default App;
