import Bugsnag, { BreadcrumbType } from "@bugsnag/js";
import { CustomBugsnagError } from "components/ErrorHandling";
import { sendError as bugsnagSendError } from "components/ErrorHandling/Bugsnag";
import { sendError as sentrySendError } from "components/ErrorHandling/Sentry";
import { isProductionBuild } from "utils/environmentVariables";

interface reportErrorResult {
  severe: () => void;
  warning: () => void;
}

const reportError = (err: CustomBugsnagError): reportErrorResult => {
  if (!isProductionBuild()) {
    return {
      severe: () => {
        console.error({ err, severity: "severe" });
      },
      warning: () => {
        console.error({ err, severity: "warning" });
      },
    };
  }

  return {
    severe: () => {
      bugsnagSendError(err, "error");
      sentrySendError(err, "error");
    },
    warning: () => {
      bugsnagSendError(err, "warning");
      sentrySendError(err, "warning");
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
