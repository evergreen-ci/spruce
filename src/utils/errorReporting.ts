import Bugsnag, { BreadcrumbType } from "@bugsnag/js";
import { addBreadcrumb, Breadcrumb } from "@sentry/react";
import { sendError as bugsnagSendError } from "components/ErrorHandling/Bugsnag";
import { sendError as sentrySendError } from "components/ErrorHandling/Sentry";
import { isProductionBuild } from "./environmentVariables";

interface reportErrorResult {
  severe: () => void;
  warning: () => void;
}

const reportError = (
  err: Error,
  metadata?: { [key: string]: any }
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
      bugsnagSendError(err, "error", metadata);
      sentrySendError(err, "error", metadata);
    },
    warning: () => {
      bugsnagSendError(err, "warning", metadata);
      sentrySendError(err, "warning", metadata);
    },
  };
};

type Metadata = {
  [key: string]: any;
};

const leaveBreadcrumb = (
  message: string,
  metadata: Metadata,
  type: BreadcrumbType
) => {
  if (!isProductionBuild()) {
    console.debug({ message, metadata, type });
  } else {
    Bugsnag.leaveBreadcrumb(message, metadata, type);
    addBreadcrumb(convertToSentryBreadcrumb(message, metadata, type));
  }
};

/**
 * Convert a Bugsnag breadcrumb to Sentry's type.
 * @param message - a string indicating details about the breadcrumb
 * @param metadata - additional fields
 * @param type - the type of Bugsnag breadcrumb to be sent
 * @returns a Sentry breadcrumb
 */
const convertToSentryBreadcrumb = (
  message: string,
  metadata: Metadata,
  type: BreadcrumbType
): Breadcrumb => {
  const breadcrumbType = convertBreadcrumbType(type);
  return {
    message,
    data: convertMetadata(metadata, breadcrumbType),
    // Divide date by 1000 because Sentry wants the timestamp in RFC 3339, or seconds (not milliseconds!) since the Unix epoch.
    timestamp: new Date().getTime() / 1000,
    type: breadcrumbType,
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

/**
 * Convert a Bugsnag breadcrumb type to one of our custom Sentry types.
 * @param breadcrumbType - the type of Bugsnag breadcrumb to be sent
 * @returns a custom Sentry breadcrumb type
 */
const convertBreadcrumbType = (
  breadcrumbType: BreadcrumbType
): SentryBreadcrumb => {
  switch (breadcrumbType) {
    case "error":
      return SentryBreadcrumb.Error;
    case "navigation":
      return SentryBreadcrumb.Navigation;
    case "process":
      return SentryBreadcrumb.UI;
    case "request":
      return SentryBreadcrumb.HTTP;
    case "user":
      return SentryBreadcrumb.User;
    case "log":
      return SentryBreadcrumb.Info;
    case "manual":
    case "state":
    default:
      return SentryBreadcrumb.Default;
  }
};

/**
 * Convert a Bugsnag metadata field to use Sentry's key names and warn about missing fields.
 * https://develop.sentry.dev/sdk/event-payloads/breadcrumbs/#breadcrumb-types
 * @param bugsnagMetadata - Metadata object using Bugsnag-specific key names
 * @param breadcrumbType - Sentry breadcrumb type
 * @returns an object with the key names converted to Sentry's names.
 */
const convertMetadata = (
  bugsnagMetadata: Metadata,
  breadcrumbType: SentryBreadcrumb
): Metadata => {
  // Convert statusCode => status_code
  if (bugsnagMetadata.statusCode) {
    const { statusCode, ...rest } = bugsnagMetadata;
    return {
      ...rest,
      status_code: statusCode,
    };
  }

  if (breadcrumbType === SentryBreadcrumb.Navigation) {
    if (!bugsnagMetadata.from) {
      console.warn(
        "Navigation breadcrumbs should include a 'from' metadata field."
      );
    }
    if (!bugsnagMetadata.to) {
      console.warn(
        "Navigation breadcrumbs should include a 'to' metadata field."
      );
    }
  }

  return bugsnagMetadata;
};

export { leaveBreadcrumb, reportError };
