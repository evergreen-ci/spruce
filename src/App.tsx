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
import { Content } from "./components/Content";
import "antd/dist/antd.css";
import { ContextProviders } from "./context/Providers";

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
            <Content />
          </GQLWrapper>
        </Router>
      </ContextProviders>
    </ErrorBoundary>
  );
};

export default App;
