import React from "react";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import { getBugsnagApiKey } from "utils/getEnvironmentVariables";

Bugsnag.start({
  apiKey: getBugsnagApiKey(),
  plugins: [new BugsnagPluginReact()],
});

const ErrorBoundaryComp = Bugsnag.getPlugin("react").createErrorBoundary(React);

const ErrorBoundary: React.FC = ({ children }) => (
  <ErrorBoundaryComp FallbackComponent={() => <h1>Something went wrong.</h1>}>
    {children}
  </ErrorBoundaryComp>
);

export { ErrorBoundary };
