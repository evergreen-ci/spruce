import Bugsnag, { BreadcrumbType } from "@bugsnag/js";
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
        console.error({ err, metadata, severity: "severe" });
      },
      warning: () => {
        console.error({ err, metadata, severity: "warning" });
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

const leaveBreadcrumb = (
  message: string,
  metadata: { [key: string]: any },
  type: BreadcrumbType
) => {
  if (!isProductionBuild()) {
    console.debug({ message, metadata, type });
  } else {
    Bugsnag.leaveBreadcrumb(message, metadata, type);
  }
};

export { leaveBreadcrumb, reportError };
