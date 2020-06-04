import { isProduction } from "utils/getEnvironmentVariables";
import Bugsnag, { Event, NotifiableError } from "@bugsnag/js";

interface reportErrorResult {
  severe: () => void;
  warning: () => void;
}

export const reportError = (err: NotifiableError): reportErrorResult => {
  if (!isProduction()) {
    return {
      severe: () => {},
      warning: () => {},
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

const sendError = (err: NotifiableError, severity: Event["severity"]) => {
  const userId = localStorage.getItem("userId");
  Bugsnag.notify(err, (event) => {
    event.severity = severity;
    event.setUser(userId);
  });
};
