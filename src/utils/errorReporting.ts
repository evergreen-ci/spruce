import { addBreadcrumb, Breadcrumb } from "@sentry/react";
import { sendError as sentrySendError } from "components/ErrorHandling/Sentry";
import { isProductionBuild } from "./environmentVariables";

interface reportErrorResult {
  severe: () => void;
  warning: () => void;
}

const reportError = (
  err: Error,
  metadata?: { [key: string]: any },
): reportErrorResult => {
  if (!isProductionBuild()) {
    return {
      severe: () => {
        console.error({ err, severity: "severe", metadata });
      },
      warning: () => {
        console.error({ err, severity: "warning", metadata });
      },
    };
  }

  return {
    severe: () => {
      sentrySendError(err, "error", metadata);
    },
    warning: () => {
      sentrySendError(err, "warning", metadata);
    },
  };
};

// The "type" field for Sentry breadcrumbs is just "string", but we can approximate the types listed here:
// https://develop.sentry.dev/sdk/event-payloads/breadcrumbs/#breadcrumb-types
enum SentryBreadcrumb {
  Default = "default",
  Debug = "debug",
  Error = "error",
  Navigation = "navigation",
  HTTP = "http",
  Info = "info",
  Query = "query",
  Transaction = "transaction",
  UI = "ui",
  User = "user",
}

const leaveBreadcrumb = (
  message: string,
  metadata: Breadcrumb["data"],
  type: SentryBreadcrumb,
) => {
  if (!isProductionBuild()) {
    console.debug({ message, metadata, type });
  } else {
    const bc: Breadcrumb = {
      message,
      data: validateMetadata(metadata, type),
      // Divide date by 1000 because Sentry wants the timestamp in RFC 3339, or seconds (not milliseconds!) since the Unix epoch.
      timestamp: new Date().getTime() / 1000,
      type,
    };
    addBreadcrumb(bc);
  }
};

/**
 * Ensure metadata follows Sentry's breadcrumb guidelines.
 * https://develop.sentry.dev/sdk/event-payloads/breadcrumbs/#breadcrumb-types
 * @param metadata - Metadata object
 * @param breadcrumbType - Sentry breadcrumb type
 * @returns an object adhering to Sentry's metadata rules.
 */
const validateMetadata = (
  metadata: Breadcrumb["data"],
  breadcrumbType: SentryBreadcrumb,
): Breadcrumb["data"] => {
  if (breadcrumbType === SentryBreadcrumb.Navigation) {
    if (!metadata.from) {
      console.warn(
        "Navigation breadcrumbs should include a 'from' metadata field.",
      );
    }
    if (!metadata.to) {
      console.warn(
        "Navigation breadcrumbs should include a 'to' metadata field.",
      );
    }
  }

  return metadata;
};

export { leaveBreadcrumb, reportError, SentryBreadcrumb };
