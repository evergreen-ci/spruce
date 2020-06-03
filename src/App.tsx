import * as React from "react";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import { Global, css } from "@emotion/core";
import GQLWrapper from "gql/GQLWrapper";
import { BrowserRouter as Router } from "react-router-dom";
import {
  getBugsnagApiKey,
  getGQLUrl,
  getSchemaString,
  isDevelopment,
  isTest,
  shouldEnableGQLMockServer,
} from "utils/getEnvironmentVariables";
import { Content } from "components/Content";
import "antd/es/breadcrumb/style/css";
import "antd/es/divider/style/css";
import "antd/es/icon/style/css";
import "antd/es/input-number/style/css";
import "antd/es/input/style/css";
import "antd/es/layout/style/css";
import "antd/es/message/style/css";
import "antd/es/modal/style/css";
import "antd/es/pagination/style/css";
import "antd/es/popconfirm/style/css";
import "antd/es/radio/style/css";
import "antd/es/select/style/css";
import "antd/es/skeleton/style/css";
import "antd/es/spin/style/css";
import "antd/es/table/style/css";
import { ContextProviders } from "context/Providers";

Bugsnag.start({
  apiKey: getBugsnagApiKey(),
  plugins: [new BugsnagPluginReact()],
});
const ErrorBoundary = Bugsnag.getPlugin("react").createErrorBoundary(React);
const App: React.FC = () => (
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
          <Global
            styles={css`
              background-color: white;
              background: white;
            `}
          />
          <Content />
        </GQLWrapper>
      </Router>
    </ContextProviders>
  </ErrorBoundary>
);

export default App;
