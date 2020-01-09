import * as React from "react";
import bugsnag from "@bugsnag/browser";
import bugsnagReact from "@bugsnag/plugin-react";
import GQLWrapper from "./utils/gql/GQLWrapper";
import {
  getBugsnagApiKey,
  getGQLUrl,
  getSchemaString,
  isDevelopment,
  isTest,
  shouldEnableGQLMockServer
} from "./utils/getEnvironmentVariables";

const bugsnagClient = bugsnag(getBugsnagApiKey());
bugsnagClient.use(bugsnagReact, React);
const ErrorBoundary = bugsnagClient.getPlugin("react");

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GQLWrapper
        gqlURL={getGQLUrl()}
        isDevelopment={isDevelopment()}
        isTest={isTest()}
        schemaString={getSchemaString()}
        credentials="include"
        shouldEnableGQLMockServer={shouldEnableGQLMockServer()}
      >
        {/*add routes here*/}
      </GQLWrapper>
    </ErrorBoundary>
  );
};

export default App;
