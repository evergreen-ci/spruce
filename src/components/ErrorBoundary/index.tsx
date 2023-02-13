import React, { Component } from "react";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import { environmentalVariables } from "utils";
import { leaveBreadcrumb } from "utils/errorReporting";
import ErrorFallback from "./ErrorFallback";

const { getBugsnagApiKey, isProductionBuild, getAppVersion, getReleaseStage } =
  environmentalVariables;

let bugsnagStarted = false;

// This error boundary is used during local development.
class DefaultErrorBoundary extends Component<{}, { hasError: boolean }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    leaveBreadcrumb("Reached error page", { error, errorInfo }, "error");
    console.error({ error, errorInfo });
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return <ErrorFallback />;
    }
    const { children } = this.props;
    return children;
  }
}

const getBoundary = () =>
  bugsnagStarted && Bugsnag.getPlugin("react")
    ? Bugsnag.getPlugin("react").createErrorBoundary(React)
    : DefaultErrorBoundary;

const initializeBugsnag = () => {
  // Only need to Bugsnag.start once, will throw console warnings otherwise.
  if (bugsnagStarted || !isProductionBuild()) {
    console.log("Bugsnag started");
    console.log(getAppVersion());
    return;
  }

  try {
    Bugsnag.start({
      apiKey: getBugsnagApiKey(),
      plugins: [new BugsnagPluginReact()],
      appVersion: getAppVersion(),
      releaseStage: getReleaseStage(),
    });
    bugsnagStarted = true;
  } catch (e) {
    // If Bugsnag fails we have no where to log it and we can't do anything about it.
    console.error("Failed to initialize Bugsnag", e);
  }
};

const ErrorBoundary: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // In some cases we do not want to enable Bugsnag (ex: testing environments).
  // In these cases we will return a fallback element.
  const ErrorBoundaryComp = getBoundary();
  return (
    <ErrorBoundaryComp FallbackComponent={() => <ErrorFallback />}>
      {children}
    </ErrorBoundaryComp>
  );
};

const resetBugsnag = () => {
  bugsnagStarted = false;
};

export { ErrorBoundary, resetBugsnag, initializeBugsnag };
