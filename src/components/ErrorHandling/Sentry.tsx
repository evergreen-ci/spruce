import {
  captureException,
  ErrorBoundary as SentryErrorBoundary,
  getCurrentHub,
  init,
  withScope,
} from "@sentry/react";
import type { Scope, SeverityLevel } from "@sentry/react";
import { environmentVariables } from "utils";
import ErrorFallback from "./ErrorFallback";

const { getReleaseStage, getSentryDSN, isProduction } = environmentVariables;

const initializeSentry = () => {
  const releaseStage = getReleaseStage() || "development";
  try {
    init({
      debug: !isProduction(),
      dsn: getSentryDSN(),
      environment: releaseStage,
      normalizeDepth: 5,
      release: APP_VERSION,
    });
  } catch (e) {
    console.error("Failed to initialize Sentry", e);
  }
};

const isInitialized = () => !!getCurrentHub().getClient();

const sendError = (
  err: Error,
  severity: SeverityLevel,
  metadata?: { [key: string]: any }
) => {
  withScope((scope) => {
    setScope(scope, { context: metadata, level: severity });

    captureException(err);
  });
};

type ScopeOptions = {
  level?: SeverityLevel;
  context?: { [key: string]: any };
};

const setScope = (scope: Scope, { context, level }: ScopeOptions = {}) => {
  const userId = localStorage.getItem("userId") ?? undefined;
  scope.setUser({ id: userId });

  if (level) scope.setLevel(level);
  if (context) scope.setContext("metadata", context);
};

const ErrorBoundary: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SentryErrorBoundary
    beforeCapture={(scope) => {
      setScope(scope);
    }}
    fallback={<ErrorFallback />}
  >
    {children}
  </SentryErrorBoundary>
);

export { ErrorBoundary, initializeSentry, isInitialized, sendError };
