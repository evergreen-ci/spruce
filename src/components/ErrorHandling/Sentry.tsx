import {
  ErrorBoundary as SentryErrorBoundary,
  init,
  captureException,
  withScope,
} from "@sentry/react";
import type { Scope, SeverityLevel } from "@sentry/react";
import type { Extras } from "@sentry/types";
import { environmentVariables } from "utils";
import ErrorFallback from "./ErrorFallback";
import { CustomBugsnagError } from "./types";

const { getReleaseStage, getSentryDSN, isProduction } = environmentVariables;

const initializeSentry = () => {
  const releaseStage = getReleaseStage() || "development";
  try {
    init({
      dsn: getSentryDSN(),
      debug: !isProduction(),
      release: APP_VERSION,
      environment: releaseStage,
    });
  } catch (e) {
    console.error("Failed to initialize Sentry", e);
  }
};

const isInitialized = () => {
  // @ts-expect-error
  const globalSentry = window.__SENTRY__; // eslint-disable-line no-underscore-dangle

  // If there is a global __SENTRY__ that means that in any of the callbacks init() was already invoked
  // https://github.com/getsentry/sentry-javascript/blob/e5e6a6bd8ab2bbec59879971595a7248fa132826/packages/browser/src/loader.js#L116-L121
  return (
    !(typeof globalSentry === "undefined") &&
    globalSentry.hub &&
    globalSentry.hub.getClient()
  );
};

const sendError = (err: CustomBugsnagError, severity: SeverityLevel) => {
  let metadata;
  if (err.metadata) {
    metadata = err.metadata;
  }

  withScope((scope) => {
    setScope(scope, { level: severity, extras: { metadata } });

    captureException(err);
  });
};

type ScopeOptions = {
  level?: SeverityLevel;
  extras?: Extras;
};

const setScope = (scope: Scope, { level, extras }: ScopeOptions = {}) => {
  const userId = localStorage.getItem("userId") ?? undefined;
  scope.setUser({ id: userId });

  if (level) scope.setLevel(level);
  if (extras) scope.setExtras({ extras });
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
