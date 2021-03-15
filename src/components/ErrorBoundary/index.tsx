import React from "react";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import { getBugsnagApiKey, isProduction } from "utils/getEnvironmentVariables";
import ErrorFallback from "./ErrorFallback";

let bugsnagStarted = false;

// This error boundary is used during local development
class DefaultErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo });
  }

  render() {
    const { hasError } = this.state as { hasError: boolean };
    if (hasError) {
      return <ErrorFallback />;
    }
    const { children } = this.props;
    return children;
  }
}

const getBoundary = () => {
  if (bugsnagStarted && Bugsnag.getPlugin("react")) {
    return Bugsnag.getPlugin("react").createErrorBoundary(React);
  }
  return DefaultErrorBoundary;
};

export const initializeBugsnag = () => {
  // Only need to Bugsnag.start once, will throw console warnings otherwise
  if (bugsnagStarted || !isProduction()) {
    return;
  }
  try {
    Bugsnag.start({
      apiKey: getBugsnagApiKey(),
      plugins: [new BugsnagPluginReact()],
    });
    bugsnagStarted = true;
  } catch (e) {}
};

const ErrorBoundary: React.FC = ({ children }) => {
  // In some cases we do not want to enable bugsnag (ex: testing environments).
  // In these cases we will return a fallback element
  const ErrorBoundaryComp = getBoundary();
  return (
    <ErrorBoundaryComp FallbackComponent={() => <ErrorFallback />}>
      {children}
    </ErrorBoundaryComp>
  );
};

export { ErrorBoundary };
