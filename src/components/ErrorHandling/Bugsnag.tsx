import React from "react";
import Bugsnag, { Event } from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import { environmentVariables } from "utils";
import ErrorFallback from "./ErrorFallback";

const { getBugsnagApiKey, getAppVersion, getReleaseStage } =
  environmentVariables;

const initializeBugsnag = () => {
  try {
    Bugsnag.start({
      apiKey: getBugsnagApiKey(),
      plugins: [new BugsnagPluginReact()],
      appVersion: getAppVersion(),
      releaseStage: getReleaseStage(),
    });
  } catch (e) {
    // If Bugsnag fails we have no where to log it and we can't do anything about it.
    console.error("Failed to initialize Bugsnag", e);
  }
};

const ErrorBoundary: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const BugsnagErrorBoundary =
    Bugsnag.getPlugin("react").createErrorBoundary(React);

  const onError = (event: Event) => {
    const userId = localStorage.getItem("userId") ?? undefined;
    event.setUser(userId);
    event.addMetadata("metadata", {
      viewedErrorPage: true,
    });
  };

  return (
    <BugsnagErrorBoundary
      onError={onError}
      FallbackComponent={() => <ErrorFallback />}
    >
      {children}
    </BugsnagErrorBoundary>
  );
};

const sendError = (
  err: Error,
  severity: Event["severity"],
  metadata?: { [key: string]: any }
) => {
  const userId = localStorage.getItem("userId");
  Bugsnag.notify(err, (event) => {
    // reassigning param is recommended usage in bugsnag docs
    // eslint-disable-next-line no-param-reassign
    event.severity = severity;
    event.setUser(userId);
    if (metadata) {
      event.addMetadata("metadata", metadata);
    }
  });
};

export { ErrorBoundary, initializeBugsnag, sendError };
