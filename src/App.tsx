import * as React from "react";
import bugsnag from "@bugsnag/browser";
import bugsnagReact from "@bugsnag/plugin-react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import GQLWrapper from "utils/gql/GQLWrapper";
import {
  getBugsnagApiKey,
  getGQLUrl,
  getSchemaString,
  isDevelopment,
  isTest,
  shouldEnableGQLMockServer
} from "./utils/getEnvironmentVariables";
import TaskPage from "pages/Task";

const bugsnagClient = bugsnag(getBugsnagApiKey());
bugsnagClient.use(bugsnagReact, React);
const ErrorBoundary = bugsnagClient.getPlugin("react");

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <GQLWrapper
          gqlURL={getGQLUrl()}
          isDevelopment={isDevelopment()}
          isTest={isTest()}
          schemaString={getSchemaString()}
          credentials="include"
          shouldEnableGQLMockServer={shouldEnableGQLMockServer()}
        >
          <Route exact path="/task/:taskID" component={TaskPage} />
        </GQLWrapper>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
