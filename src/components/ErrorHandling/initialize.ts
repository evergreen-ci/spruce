import Bugsnag from "@bugsnag/js";
import { environmentVariables } from "utils";
import { initializeBugsnag } from "./Bugsnag";
import { initializeSentry, isInitialized } from "./Sentry";

const { isProductionBuild } = environmentVariables;

export const initializeErrorHandling = () => {
  if (!isProductionBuild()) {
    return;
  }

  if (!Bugsnag.isStarted()) {
    initializeBugsnag();
  }

  if (!isInitialized()) {
    initializeSentry();
  }
};
