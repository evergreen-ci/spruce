import Bugsnag, { Event, NotifiableError, BreadcrumbType } from "@bugsnag/js";
import { isProduction } from "utils/environmentalVariables";

interface reportErrorResult {
  severe: () => void;
  warning: () => void;
}

type CustomBugsnagError = NotifiableError & {
  metadata?: any;
};

const reportError = (err: CustomBugsnagError): reportErrorResult => {
  if (!isProduction()) {
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
      sendError(err, "error");
    },
    warning: () => {
      sendError(err, "warning");
    },
  };
};

const sendError = (err: CustomBugsnagError, severity: Event["severity"]) => {
  const userId = localStorage.getItem("userId");
  let metadata;
  if (err.metadata) {
    metadata = err.metadata;
  }
  Bugsnag.notify(err, (event) => {
    // reassigning param is recommended usage in bugsnag docs
    // eslint-disable-next-line no-param-reassign
    event.severity = severity;
    event.setUser(userId);
    if (metadata) {
      event.addMetadata("metadata", { ...metadata });
    }
  });
};

const leaveBreadcrumb = (
  message: string,
  metadata: { [key: string]: any },
  type: BreadcrumbType
) => {
  if (!isProduction()) {
    console.debug({ message, metadata, type });
  } else {
    Bugsnag.leaveBreadcrumb(message, metadata, type);
  }
};

export { leaveBreadcrumb, reportError };
