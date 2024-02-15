import {
  captureException,
  ErrorBoundary as SentryErrorBoundary,
  getCurrentHub,
  init,
  Replay,
  setTag,
  withScope,
} from "@sentry/react";
import type { Scope, SeverityLevel } from "@sentry/react";
import { environmentVariables } from "utils";
import ErrorFallback from "./ErrorFallback";

const { getReleaseStage, getSentryDSN, isProduction } = environmentVariables;

const initializeSentry = () => {
  const releaseStage = getReleaseStage() || "development";
  const productionEnv = isProduction();
  try {
    init({
      dsn: getSentryDSN(),
      debug: !productionEnv,
      normalizeDepth: 5,
      environment: releaseStage,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: productionEnv ? 0.6 : 1.0,
      integrations: [
        new Replay({
          blockAllMedia: productionEnv,
          maskAllInputs: productionEnv,
          maskAllText: productionEnv,
        }),
      ],
    });
  } catch (e) {
    console.error("Failed to initialize Sentry", e);
  }
};

const isInitialized = () => !!getCurrentHub().getClient();

const sendError = (
  err: Error,
  severity: SeverityLevel,
  metadata?: { [key: string]: any },
) => {
  withScope((scope) => {
    setScope(scope, { level: severity, context: metadata });

    const { gqlErr, operationName } = metadata ?? {};

    // Add additional sorting for GraphQL errors
    if (operationName) {
      // A custom fingerprint allows for more intelligent grouping
      const fingerprint = [operationName];
      if (gqlErr?.path && Array.isArray(gqlErr.path)) {
        fingerprint.push(...gqlErr.path);
      }
      scope.setFingerprint(fingerprint);

      // Apply tag, which is a searchable/filterable property
      setTag("operationName", metadata.operationName);
    }

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

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
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
